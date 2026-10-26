export function genId(): string {
  return Math.random().toString(36).slice(2, 9) + Date.now().toString(36).slice(-4);
}

export function fmtNaira(amount: number): string {
  return "₦" + new Intl.NumberFormat("en-NG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);
}

export function daysUntil(dateStr: string): number {
  if (!dateStr) return 0;
  const target = new Date(dateStr + "T00:00:00").getTime();
  const today = new Date().setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function calculateLeaseProgress(startDate: string, endDate: string): number {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate + "T00:00:00").getTime();
  const end = new Date(endDate + "T00:00:00").getTime();
  const now = Date.now();

  if (end <= start) return 100;
  if (now <= start) return 0;
  if (now >= end) return 100;

  return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    const d = new Date(dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export function generateReceiptNumber(): string {
  const year = new Date().getFullYear();
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `TR-RCT-${year}-${rand}`;
}

export function cleanPhoneForWhatsApp(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("0")) {
    return "234" + cleaned.slice(1);
  }
  return cleaned;
}

export function createWhatsAppRentReceiptMessage(params: {
  landlordOrAgentName: string;
  tenantName?: string;
  propertyAddress: string;
  amount: number;
  period: string;
  receiptNo: string;
  paidDate: string;
}): string {
  const text = `Hello ${params.landlordOrAgentName},\n\nThis is to confirm payment for rent at *${params.propertyAddress}*.\n\n• Amount: *${fmtNaira(params.amount)}*\n• Period: *${params.period}*\n• Paid On: *${params.paidDate}*\n• Receipt Ref: *${params.receiptNo}*\n\nPlease find the record saved via TrustRent. Thank you!`;
  return encodeURIComponent(text);
}

export function createWhatsAppRenewalMessage(params: {
  landlordOrAgentName: string;
  propertyAddress: string;
  endDate: string;
  daysRemaining: number;
}): string {
  const text = `Hello ${params.landlordOrAgentName},\n\nI hope you are well. Regarding my tenancy at *${params.propertyAddress}*, my lease is due for renewal on *${params.endDate}* (approx ${params.daysRemaining} days remaining).\n\nI would appreciate discussing the renewal terms at your earliest convenience.\n\nBest regards.`;
  return encodeURIComponent(text);
}

