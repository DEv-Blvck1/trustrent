export type PaymentStatus = "paid" | "pending" | "overdue";
export type RentFrequency = "monthly" | "quarterly" | "annually";
export type PropertyStatus = "active" | "expired" | "terminated";
export type ListingType = "rent" | "sale" | "lease";
export type UserRole = "guest" | "tenant" | "agent" | "owner";

export interface UserSession {
  role: UserRole;
  email: string;
  name: string;
}

export interface TenantProfile {
  name: string;
  email: string;
  phone: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  occupation: string;
  notifyEmail: boolean;
  notifyWhatsApp: boolean;
  notifySms: boolean;
}

export interface AgentProfile {
  name: string;
  agencyName: string;
  email: string;
  phone: string;
  licenseNumber: string;
  isVerified: boolean;
  operatingCities: string;
  officeAddress: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bio: string;
}

export interface OwnerProfile {
  name: string;
  companyName: string;
  email: string;
  phone: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  defaultNoticeDays: number;
  autoRemindTenant: boolean;
  notifyEmail: boolean;
  notifyWhatsApp: boolean;
}

export interface PaymentRecord {
  id: string;
  period: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  receiptNo?: string;
  paymentMethod?: string;
  notes?: string;
  issuedByOwner?: boolean;
}

export interface DefectEvidence {
  id: string;
  title: string;
  category: "plumbing" | "electrical" | "walls_paint" | "fixtures" | "roof_ceiling" | "other";
  description: string;
  dateLogged: string;
  imageUrl?: string;
  isResolved: boolean;
  costEstimate?: number;
}

export interface CautionFeeTracker {
  depositAmount: number;
  refundStatus: "held" | "requested" | "in_review" | "partially_refunded" | "fully_refunded" | "disputed";
  refundAmountReceived?: number;
  deductionsProposed?: number;
  deductionReasons?: string;
  requestDate?: string;
  targetRefundDate?: string;
}

export interface PropertyExpense {
  id: string;
  propertyId: string;
  title: string;
  category: "repair" | "remodeling" | "renovation" | "plumbing" | "electrical" | "generator_fuel" | "cleaning" | "other";
  amount: number;
  date: string;
  vendorName?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  propertyId: string;
  senderRole: "owner" | "tenant" | "agent";
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
}

export interface ConversationSettings {
  isLocked: boolean;
  lockedReason?: string;
  lastUpdated: string;
}

export interface TenantDocument {
  id: string;
  propertyId: string;
  name: string;
  category: "tenancy_agreement" | "id_card" | "utility_bill" | "inspection_sheet" | "receipt" | "other";
  uploadDate: string;
  fileSize: string;
  fileData?: string; // Base64 preview
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  priority: "normal" | "urgent" | "maintenance";
  authorName: string;
}

export interface AgentApplication {
  id: string;
  name: string;
  agencyName: string;
  phone: string;
  email: string;
  city: string;
  licenseNumber: string;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "reminder" | "announcement" | "receipt" | "message" | "agent" | "system";
  targetRole: "all" | "tenant" | "agent" | "owner";
  propertyId?: string;
  timestamp: string;
  read: boolean;
}

export interface Property {
  id: string;
  title?: string;
  address: string;
  area: string;
  city: string;
  state?: string;
  landlordName: string;
  landlordPhone: string;
  landlordEmail?: string;
  agentName?: string;
  agentPhone?: string;
  agentEmail?: string;
  isAgentVerified?: boolean;
  listingType: ListingType;
  rentAmount: number; // or sale price
  frequency: RentFrequency;
  startDate: string;
  endDate: string;
  cautionFee: number;
  agentFee: number;
  legalAgreementFee?: number;
  serviceCharge?: number;
  notes: string;
  status: PropertyStatus;
  // Specifications for public marketplace
  bedrooms: number;
  bathrooms: number;
  kitchens: number;
  squareFeet: number;
  imageUrl?: string;
  featured?: boolean;
  publishedToHome: boolean;
  // Nested records
  payments: PaymentRecord[];
  defects: DefectEvidence[];
  cautionTracker?: CautionFeeTracker;
  expenses: PropertyExpense[];
  documents: TenantDocument[];
  conversationSettings: ConversationSettings;
}
