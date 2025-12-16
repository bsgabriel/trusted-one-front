import type { BasePageableParams } from './pageable';

export interface Company {
  companyId?: number;
  name: string;
  partners: CompanyPartner[]; 
}

export interface CompanyListing {
  companyId: number;
  name: string;
  partnerCount: number;
}

export interface CompanyListParams extends BasePageableParams {
  search?: string;
}

export interface CompanyFormRequest {
  companyId?: number;
  name: string;
  partners: number[];
}

export interface CompanyPartner {
  partnerId: number;
  name: string;
}
