export interface ReferralCreateParams {
  partnerId: number;
  expertiseId: number;
  referredTo: string;
}

export interface Referral {
  referralId: number;
  partnerName: string;
  expertise: string;
  specialization: string;
  referredTo: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
}
