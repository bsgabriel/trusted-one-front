import type { BasePageableParams } from "./pageable";

export interface Company {
  companyId: number | null;
  name: string;
}

export interface CompanyListing {
  companyId: number,
  name: string,
  partnerCount: number,
}

export interface CompanyListParams extends BasePageableParams {
  search?: string;
}