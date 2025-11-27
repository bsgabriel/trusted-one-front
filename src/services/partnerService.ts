import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Partner, PartnerListing, PartnerListParams } from '../types/partner';
import type { PageResponse } from '../types/pageable';
import type { Expertise } from 'src/types/expertise';

export class PartnerService {
  async listPartners(params: PartnerListParams): Promise<ApiResult<PageResponse<PartnerListing>>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', params.page.toString());
    queryParams.append('size', params.size.toString());
    
    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.fullSearch === false) {
      queryParams.append('fullSearch', 'false');
    }
    
    return apiService.get<PageResponse<PartnerListing>>(`/partner/listing?${queryParams.toString()}`);
  }

  async createPartner(partner: Partner): Promise<ApiResult<Partner>> {
    return apiService.post<Partner, Partner>('/partner', partner);
  }

  async getPartnerById(id: number): Promise<ApiResult<Partner>> {
    return apiService.get<Partner>(`/partner/${id}`);
  }

  async updatePartner(partner: Partner): Promise<ApiResult<Partner>> {
    return apiService.put<Partner, Partner>(`/partner/${partner.partnerId}`, partner);
  }

  async deletePartner(id: number): Promise<ApiResult<void>> {
    return apiService.delete<void>(`/partner/${id}`);
  }

  async findfindRecommendableExpertises(partnerId: number): Promise<ApiResult<Expertise[]>> {
    return apiService.get<Expertise[]>(`/partner/${partnerId}/recommendable-expertises`);
  }
}

export const partnerService = new PartnerService();