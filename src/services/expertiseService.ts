import { apiService } from './apiUtils';
import type { ExpertiseListing } from 'src/types/expertise';

export class ExpertiseService {
  async getParentExpertises(): Promise<ExpertiseListing[]> {
    return apiService.get<ExpertiseListing[]>('/expertise/parents');
  }

  async getChildren(parentExpertiseId: number): Promise<ExpertiseListing[]> {
    return apiService.get<ExpertiseListing[]>(`/expertise/${parentExpertiseId}/children`);
  }
}

export const expertiseService = new ExpertiseService();
