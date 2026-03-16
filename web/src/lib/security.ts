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
  if (!ipAddress || ipAddress === 'unknown') return true; // Skip if no IP

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

  if (count >= limit) {
    // Log suspicious activity if rate limit is hit
    await alertSecurity({
      type: 'RATE_LIMIT_HIT',
      severity: 'MEDIUM',
      ipAddress: ipAddress,
      details: { action, count, limit, windowMs }
    });
    return false;
  }

  return true;
}

/**
 * Security Alerting System
 */
export async function alertSecurity({
  type,
  severity,
  ipAddress,
  userId,
  details
}: {
  type: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  ipAddress?: string;
  userId?: string;
  details?: any;
}) {
  // 1. Log to AuditLog
  await logAuditAction({
    userId,
    action: `SECURITY_ALERT_${type}`,
    ipAddress,
    details: { severity, ...details }
  });

  // 2. Alert admins (mocking with console for now)
  const alertMsg = `[SECURITY ALERT] [${severity}] ${type} for IP: ${ipAddress || 'unknown'}`;
  console.warn(alertMsg);

  // 3. Potential integration with external monitoring (Sentry, PagerDuty, etc.)
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    // sendToMonitoring(alertMsg, details);
  }
}

/**
 * Detects suspicious activity patterns
 */
export async function detectSuspiciousActivity(ipAddress: string) {
  if (!ipAddress || ipAddress === 'unknown') return { suspicious: false };

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // Check for multiple failed logins
  const failedLogins = await prisma.auditLog.count({
    where: {
      ip_address: ipAddress,
      action: 'LOGIN_FAILED',
      created_at: { gte: oneHourAgo }
    }
  });

  if (failedLogins > 10) {
    await alertSecurity({
      type: 'BRUTE_FORCE_ATTEMPT',
      severity: 'HIGH',
      ipAddress: ipAddress,
      details: { failedLogins }
    });
    return { 
      suspicious: true, 
      reason: 'BRUTE_FORCE_ATTEMPT', 
      details: `${failedLogins} failed logins in the last hour` 
    };
  }

  // Check for multiple password reset requests
  const resetRequests = await prisma.auditLog.count({
    where: {
      ip_address: ipAddress,
      action: 'PASSWORD_RESET_REQUESTED',
      created_at: { gte: oneHourAgo }
    }
  });

  if (resetRequests > 5) {
    await alertSecurity({
      type: 'RESET_TOKEN_ENUMERATION',
      severity: 'HIGH',
      ipAddress: ipAddress,
      details: { resetRequests }
    });
    return { 
      suspicious: true, 
      reason: 'RESET_TOKEN_ENUMERATION', 
      details: `${resetRequests} reset requests in the last hour` 
    };
  }

  return { suspicious: false };
}

/**
 * Exponential backoff helper for security responses
 */
export async function securityDelay(attempts: number) {
  if (attempts <= 1) return;
  const delay = Math.min(1000 * Math.pow(2, attempts - 1), 10000); // Max 10s delay
  await new Promise(resolve => setTimeout(resolve, delay));
}
