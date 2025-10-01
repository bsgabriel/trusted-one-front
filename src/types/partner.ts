import { Company } from "./company";
import { Group } from "./group";

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