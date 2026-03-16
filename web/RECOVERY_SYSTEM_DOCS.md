# Password Recovery System Architecture

This document describes the implementation of the password recovery system in the Golden Russia project.

## Architecture Overview

The system follows a secure, token-based password reset flow with multiple layers of security as per OWASP recommendations.

### Components

1.  **Frontend (Next.js Client Components)**
    *   `ForgotPasswordForm`: Handles email submission and UI states (loading, success, error).
    *   `ResetPasswordForm`: Handles new password entry with complexity validation.
    *   `WelcomeScreen` integration: Added "Forgot Password?" link and conditional form rendering.

2.  **Backend (Next.js Server Actions)**
    *   `forgotPassword`: Generates tokens, handles rate limiting, audit logging, and email dispatch.
    *   `resetPassword`: Validates tokens, updates passwords, invalidates tokens, and sends confirmation emails.

3.  **Security Layer (`src/lib/security.ts`)**
    *   **Rate Limiting**: Limits to 3 attempts per hour per IP address.
    *   **Audit Logging**: Every recovery attempt and successful reset is logged with IP and user details.
    *   **Exponential Backoff**: Anti-brute-force protection for token validation and email enumeration.
    *   **Secure Tokens**: Cryptographically secure 32-byte hex tokens.

4.  **Database (Prisma/SQLite)**
    *   `PasswordResetToken`: Stores user-linked tokens with a 24-hour expiration.
    *   `AuditLog`: Permanent record of security-related actions.
    *   `User.last_password_reset_at`: Tracking for security auditing.

## API Endpoints (Server Actions)

### `forgotPassword(formData: FormData)`
*   **Input**: `email` (string)
*   **Security**: Rate limiting (3/hr), Audit Log, Anti-enumeration delay.
*   **Success**: Returns `{ success: true }` regardless of whether email exists (security).
*   **Error**: Returns `{ error: string }` for validation or rate limit issues.

### `resetPassword(formData: FormData)`
*   **Input**: `token` (string), `password` (string)
*   **Validation**: Password complexity (min 8 chars, uppercase, digit, special char).
*   **Action**: Updates password, deletes all user tokens, sends notification email.

## Email Templates
*   Localized templates for Russian and Chinese.
*   Mobile-responsive HTML design.
*   Secure action links with 24-hour validity.

## Testing
*   Unit tests for `ForgotPasswordForm` using Jest and React Testing Library.
*   Integration testing through server actions logic.
