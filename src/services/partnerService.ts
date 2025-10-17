import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Partner, PartnerListing, PartnerListParams } from '../types/partner';
import type { PageResponse } from '../types/pageable';

export class PartnerService {
  async listPartners(params: PartnerListParams): Promise<ApiResult<PageResponse<PartnerListing>>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', params.page.toString());
    queryParams.append('size', params.size.toString());
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    return apiService.get<PageResponse<PartnerListing>>(`/partner/listing?${queryParams.toString()}`);
  }

  async createPartner(partner: Partner): Promise<ApiResult<Partner>> {
    return apiService.post<Partner, Partner>('/partner', partner);
  }

  async getPartnerById(id: number): Promise<ApiResult<Partner>> {
    return apiService.get<Partner>(`/partner/${id}`);
  }
}

export const partnerService = new PartnerService();