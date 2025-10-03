import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Partner, PartnerListParams } from '../types/partner';
import type { PageResponse } from '../types/pageable';

export class PartnerService {
  async listPartners(params: PartnerListParams): Promise<ApiResult<PageResponse<Partner>>> {
    const queryParams = new URLSearchParams();
    
    queryParams.append('page', params.page.toString());
    queryParams.append('size', params.size.toString());
    
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    return apiService.get<PageResponse<Partner>>(`/partner/listing?${queryParams.toString()}`);
  }
}

export const partnerService = new PartnerService();