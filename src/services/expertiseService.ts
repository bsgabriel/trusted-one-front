import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { ExpertiseListing } from 'src/types/expertise';

export class ExpertiseService {
  async getParentExpertises(): Promise<ApiResult<ExpertiseListing[]>> {
    return apiService.get<ExpertiseListing[]>('/expertise/parents');
  }

  async getChildren(parentExpertiseId: number): Promise<ApiResult<ExpertiseListing[]>> {
    return apiService.get<ExpertiseListing[]>(`/expertise/${parentExpertiseId}/children`);
  }
}

export const expertiseService = new ExpertiseService();
