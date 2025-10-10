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

export interface ContactMethod {
  type: string;
  value: string;
}

export interface BusinessProfile {
  mainProducts: string;
  uniqueProduct: string;
  idealClient: string;
  conversationStarter: string;
}

export enum GainsCategory {
  GOALS = 'GOALS',
  ACCOMPLISHMENTS = 'ACCOMPLISHMENTS',
  INTERESTS = 'INTERESTS',
  NETWORKS = 'NETWORKS',
  SKILLS = 'SKILLS',
}
