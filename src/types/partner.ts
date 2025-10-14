import type { Company } from './company';
import type { ContactMethod } from './contactMethod';
import type { Expertise } from './expertise';
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

export enum BusinessProfileCategory {
  CORE_PRODUCTS_SERVICES = 'CORE_PRODUCTS_SERVICES',
  UNIQUE_VALUE_PROPOSITION = 'UNIQUE_VALUE_PROPOSITION',
  TARGET_CLIENT_PROFILE = 'TARGET_CLIENT_PROFILE',
  CONVERSATION_STARTER = 'CONVERSATION_STARTER',
  OPPORTUNITY_SUGGESTIONS = 'OPPORTUNITY_SUGGESTIONS',
}

export enum GainsCategory {
  GOAL = 'GOAL',
  ACCOMPLISHMENT = 'ACCOMPLISHMENT',
  INTEREST = 'INTEREST',
  NETWORK = 'NETWORK',
  SKILL = 'SKILL',
}

export interface GainsProfile {
  gainsProfileId?: number;
  category: GainsCategory;
  info: string;
}

export interface BusinessProfile {
  businessProfileId?: number;
  category: BusinessProfileCategory;
  info: string;
}

export interface PartnerListing {
  partnerId: number;
  name: string;
  company?: Company;
  group?: Group;
  metrics: PartnerMetrics;
}

export interface Partner {
  partnerId?: number;
  name: string;
  company?: Company;
  group?: Group;
  contactMethods: ContactMethod[];
  expertises: Expertise[];
  gainsProfile: GainsProfile[];
  businessProfile: BusinessProfile[];
}
