import type { BasePageableParams } from "./pageable";

export interface Group {
  groupId?: number;
  name: string;
  description?: string;
  partners: GroupPartner[];
  isNew?: boolean
}

export interface GroupListing {
  groupId: number,
  name: string,
  description?: string,
  partnerCount: number,
}

export interface GroupListParams extends BasePageableParams {
  search?: string;
}

export interface GroupPartner {
  partnerId: number;
  name: string;
}