/**
 * Security & Sanitization Utilities for TrustRent
 * Defends against XSS, injection attacks, insecure file uploads, and brute force attempts.
 */

// Basic HTML entity encoding to prevent XSS in textareas, chats, and notes
export function sanitizeText(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Strips dangerous characters and script patterns from freeform inputs
export function sanitizeInput(input: string): string {
  if (!input) return "";
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/javascript:/gi, "")
    .replace(/on\w+=/gi, "")
    .trim();
}

// Strict email validator matching RFC 5322 standard
export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)+$/;
  return re.test(String(email).toLowerCase());
}

// Nigerian & international phone number validator
export function validatePhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, "");
  // Nigerian numbers are usually 11 digits (080...) or 13 digits (23480...)
  return cleaned.length >= 10 && cleaned.length <= 14;
}

// Security checker for allowed file uploads
export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];

const BLOCKED_EXTENSIONS = [
  ".exe", ".bat", ".cmd", ".sh", ".php", ".js", ".html", ".htm",
  ".vbs", ".msi", ".jar", ".scr", ".pif", ".wsf", ".cpl"
];

export function validateFileUpload(file: File, maxSizeBytes = 5 * 1024 * 1024): FileValidationResult {
  if (!file) {
    return { isValid: false, error: "No file selected." };
  }

  // Check file size (default 5MB max)
  if (file.size > maxSizeBytes) {
    return {
      isValid: false,
      error: `File size exceeds the ${(maxSizeBytes / 1024 / 1024).toFixed(0)}MB security limit.`
    };
  }

  // Check file extension against dangerous executables
  const fileName = file.name.toLowerCase();
  for (const ext of BLOCKED_EXTENSIONS) {
    if (fileName.endsWith(ext)) {
      return {
        isValid: false,
        error: `Security Alert: Files with extension "${ext}" are strictly prohibited.`
      };
    }
  }

  // Check MIME type
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: `Unsupported file type (${file.type}). Only PDF, JPEG, PNG, and WebP are permitted.`
    };
  }

  return { isValid: true };
}

// In-memory rate limiter to prevent denial-of-service / brute-force abuse
class ClientRateLimiter {
  private attempts: Map<string, { count: number; firstAttempt: number }> = new Map();

  check(actionKey: string, maxAttempts = 5, windowMs = 30000): { allowed: boolean; waitSeconds?: number } {
    const now = Date.now();
    const record = this.attempts.get(actionKey);

    if (!record) {
      this.attempts.set(actionKey, { count: 1, firstAttempt: now });
      return { allowed: true };
    }

    if (now - record.firstAttempt > windowMs) {
      this.attempts.set(actionKey, { count: 1, firstAttempt: now });
      return { allowed: true };
    }

    if (record.count >= maxAttempts) {
      const waitSeconds = Math.ceil((record.firstAttempt + windowMs - now) / 1000);
      return { allowed: false, waitSeconds: Math.max(1, waitSeconds) };
    }

    record.count += 1;
    return { allowed: true };
  }

  reset(actionKey: string): void {
    this.attempts.delete(actionKey);
  }
}

export const rateLimiter = new ClientRateLimiter();

