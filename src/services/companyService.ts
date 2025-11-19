import { apiService } from './apiUtils';
import type { Company } from 'src/types/company';

export class CompanyService {
  async getCompanies(): Promise<Company[]> {
    return apiService.get<Company[]>('/company');
  }
}

export const companyService = new CompanyService();
