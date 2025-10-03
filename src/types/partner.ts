import type { Company } from "./company";
import type { Group } from "./group";
import type { BasePageableParams } from "./pageable";

export interface PartnerListParams extends BasePageableParams {
  search?: string | undefined
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