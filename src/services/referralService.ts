import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { ReferralCreateParams } from 'src/types/referral';

export class ReferralService {
  async createReferral(params: ReferralCreateParams): Promise<ApiResult<void>> {
    return apiService.post<void, ReferralCreateParams>('/referral', params);
  }
}

export const referralService = new ReferralService();
