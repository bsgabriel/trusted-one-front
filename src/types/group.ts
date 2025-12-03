import type { BasePageableParams } from "./pageable";

export interface Group {
  groupId: number | null;
  name: string;
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
