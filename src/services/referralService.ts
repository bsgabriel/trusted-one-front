import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Referral, ReferralCreateParams, ReferralListParams, ReferralStats, ReferralStatus } from 'src/types/referral';
import type { PageResponse } from 'src/types/pageable';

export class ReferralService {
  async createReferral(params: ReferralCreateParams): Promise<ApiResult<void>> {
    return apiService.post<void, ReferralCreateParams>('/referral', params);
  }

  async listReferrals(params: ReferralListParams): Promise<ApiResult<PageResponse<Referral>>> {
    const queryParams = new URLSearchParams();

    queryParams.append('page', params.page.toString());
    queryParams.append('size', params.size.toString());

    if (params.search) {
      queryParams.append('search', params.search);
    }

    if (params.status) {
      queryParams.append('status', params.status);
    }

    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }

    return apiService.get<PageResponse<Referral>>(`/referral?${queryParams.toString()}`);
  }

  async updateReferralStatus(referralId: number, status: ReferralStatus): Promise<ApiResult<Referral>> {
    return apiService.put<Referral, ReferralStatus>(`/referral/${referralId}/status`, status);
  }

  async getStats(): Promise<ApiResult<ReferralStats>> {
    return apiService.get<ReferralStats>('/referral/stats');
  }
}

export const referralService = new ReferralService();
