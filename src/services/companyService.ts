import { apiService } from './apiUtils';
import type { Company, CompanyListing, CompanyListParams } from 'src/types/company';
import type { PageResponse } from 'src/types/pageable';

export class CompanyService {
  async getCompanies(): Promise<Company[]> {
    return apiService.get<Company[]>('/company');
  }

  async listCompanies(params: CompanyListParams): Promise<PageResponse<CompanyListing>> {
    const queryParams = new URLSearchParams();
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    return apiService.get<PageResponse<CompanyListing>>(`/company/listing?${queryParams.toString()}`);
  }
}

export const companyService = new CompanyService();
