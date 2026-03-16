import prisma from './db';

/**
 * Log an action to the audit_logs table
 */
export async function logAuditAction({
  userId,
  action,
  details,
  ipAddress
}: {
  userId?: string;
  action: string;
  details?: any;
  ipAddress?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        user_id: userId,
        action,
        details: details ? JSON.stringify(details) : null,
        ip_address: ipAddress
      }
    });
  } catch (error) {
    console.error('Failed to log audit action:', error);
  }
}

/**
 * Simple rate limiter check using AuditLog table
 * Limits actions per IP address within a timeframe
 */
export async function checkRateLimit(ipAddress: string, action: string, limit: number, windowMs: number): Promise<boolean> {
  if (!ipAddress) return true; // Skip if no IP

  const windowStart = new Date(Date.now() - windowMs);

  const count = await prisma.auditLog.count({
    where: {
      ip_address: ipAddress,
      action,
      created_at: {
        gte: windowStart
      }
    }
  });

  return count < limit;
}

/**
 * Exponential backoff helper for security responses
 */
export async function securityDelay(attempts: number) {
  if (attempts <= 1) return;
  const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000); // Max 10s delay
  await new Promise(resolve => setTimeout(resolve, delay));
}
