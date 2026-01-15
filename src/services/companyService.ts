import { apiService } from './apiUtils';
import type { Company, CompanyFormRequest, CompanyListing, CompanyListParams } from 'src/types/company';
import type { PageResponse } from 'src/types/pageable';

export class CompanyService {
  async listCompanies(params: CompanyListParams): Promise<PageResponse<CompanyListing>> {
    const queryParams = new URLSearchParams();
    if (params.search) {
      queryParams.append('search', params.search);
    }
    
    return apiService.get<PageResponse<CompanyListing>>(`/company?${queryParams.toString()}`);
  }

  async fetchCompany(companyId: number): Promise<Company> {
    return apiService.get<Company>(`/company/${companyId}`);
  }

  async deleteCompany(companyId: number): Promise<void> {
    return apiService.delete<void>(`/company/${companyId}`);
  }

  async updateCompany(company: CompanyFormRequest): Promise<Company> {
    return apiService.put<Company>(`/company/${company.companyId}`, company);
  }

  async createCompany(company: CompanyFormRequest): Promise<Company> {
    return apiService.post<Company>('/company', company);
  }
}

export const companyService = new CompanyService();
