import { apiService } from './apiUtils';
import type { Company, CompanyFormRequest, CompanyListing, CompanyListParams } from 'src/types/company';
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

  async fetchCompanyById(companyId: number): Promise<Company> {
    return apiService.get<Company>(`/company/${companyId}`);
  }

  async deleteCompany(groupId: number): Promise<void> {
    return apiService.delete<void>(`/company/${groupId}`);
  }

  async updateCompany(company: CompanyFormRequest): Promise<Company> {
    return apiService.put<Company>(`/company/${company.companyId}`, company);
  }

  async createCompany(company: CompanyFormRequest): Promise<Company> {
    return apiService.post<Company>('/company', company);
  }
}

export const companyService = new CompanyService();
