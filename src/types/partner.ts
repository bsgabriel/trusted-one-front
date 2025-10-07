import type { Company } from './company';
import type { Group } from './group';
import type { BasePageableParams } from './pageable';

export interface PartnerListParams extends BasePageableParams {
  search?: string | undefined;
}

export interface PartnerMetrics {
  pendingReferrals: number;
  rejectedReferrals: number;
  acceptedReferrals: number;
}

export interface Partner {
  partnerId: string;
  name: string;
  company?: Company;
  group?: Group;
  metrics: PartnerMetrics;
}

export interface BasicData {
  name: string;
  group: Group | undefined;
  company: Company | undefined;
}

export interface ContactMethod {
  type: string;
  value: string;
}

export interface AdditionalInfo {
  mainProducts: string;
  uniqueProduct: string;
  idealClient: string;
  conversationStarter: string;
}

export interface GainsProfile {
  goals: string;
  accomplishments: string;
  interests: string;
  networks: string;
  skills: string;
}
