export type CaseStatus = 'AWAITING_PRO_SELECTION' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
export type ProType = 'TAX' | 'LEGAL' | 'OTHER';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

export interface UserProfile {
  id: string;
  role: 'CLIENT' | 'PRO';
  email: string;
  firstName?: string;
  lastName?: string;
}
