import { apiService } from './apiUtils';
import type {
  ExpertiseListing,
  Expertise,
  Specialization,
  ExpertiseListParams,
  ExpertiseFormRequest,
  SpecializationListing,
  SpecializationFormRequest,
} from 'src/types/expertise';
import type { PageResponse } from 'src/types/pageable';

export class ExpertiseService {
  async listExpertises(params: ExpertiseListParams): Promise<PageResponse<ExpertiseListing>> {
    const queryParams = new URLSearchParams();

    if (params.search) {
      queryParams.append('search', params.search);
    }

    return apiService.get<PageResponse<ExpertiseListing>>(`/expertise?${queryParams.toString()}`);
  }

  async fetchExpertise(expertiseId: number): Promise<Expertise> {
    return apiService.get<Expertise>(`/expertise/${expertiseId}`);
  }

  async createExpertise(form: ExpertiseFormRequest): Promise<Expertise> {
    return apiService.post<Expertise>('/expertise', form);
  }

  async updateExpertise(expertiseId: number, form: ExpertiseFormRequest): Promise<Expertise> {
    return apiService.put<Expertise>(`/expertise/${expertiseId}`, form);
  }

  async deleteExpertise(expertiseId: number): Promise<void> {
    return apiService.delete<void>(`/expertise/${expertiseId}`);
  }

  async listSpecializations(expertiseId: number): Promise<SpecializationListing[]> {
    return apiService.get<SpecializationListing[]>(`/expertise/${expertiseId}/specialization`);
  }

  async fetchSpecialization(specializationId: number): Promise<Specialization> {
    return apiService.get<Specialization>(`/expertise/specialization/${specializationId}`);
  }

  async updateSpecialization(specializationId: number, form: SpecializationFormRequest): Promise<Specialization> {
    return apiService.put<Specialization>(`/expertise/specialization/${specializationId}`, form);
  }

  async deleteSpecialization(specializationId: number): Promise<void> {
    return apiService.delete<void>(`/expertise/specialization/${specializationId}`);
  }
}

export const expertiseService = new ExpertiseService();
