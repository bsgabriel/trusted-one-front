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

export enum BusinessProfileCategory {
  CORE_PRODUCTS_SERVICES = 'CORE_PRODUCTS_SERVICES,',
  UNIQUE_VALUE_PROPOSITION = 'UNIQUE_VALUE_PROPOSITION,',
  TARGET_CLIENT_PROFILE = 'TARGET_CLIENT_PROFILE,',
  CONVERSATION_STARTER = 'CONVERSATION_STARTER,',
  OPPORTUNITY_SUGGESTIONS = 'OPPORTUNITY_SUGGESTIONS',
}

export enum GainsCategory {
  GOALS = 'GOALS',
  ACCOMPLISHMENTS = 'ACCOMPLISHMENTS',
  INTERESTS = 'INTERESTS',
  NETWORKS = 'NETWORKS',
  SKILLS = 'SKILLS',
}
