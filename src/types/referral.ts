import type { BasePageableParams } from './pageable';

export type ReferralStatus = 'PENDING' | 'ACCEPTED' | 'DECLINED';

export interface ReferralCreateParams {
  partnerId: number;
  expertiseId: number;
  referredTo: string;
}

export interface ReferralListParams extends BasePageableParams {
  search?: string;
  status?: ReferralStatus | null;
  sortBy?: string;
}

export interface Referral {
  referralId: number;
  partnerName: string;
  expertise: string;
  specialization: string;
  referredTo: string;
  status: ReferralStatus;
  createdAt: Date;
  updatedAt: Date;
}

interface MonthlyStats {
  created: number;
  responses: number;
  accepted: number;
  declined: number;
}

export interface ReferralStats {
  total: number;
  accepted: number;
  declined: number;
  pending: number;
  currentMonth: MonthlyStats;
  previousMonth: MonthlyStats;
}
