import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Company } from 'src/types/company';

export class CompanyService {
  async getCompanies(): Promise<ApiResult<Company[]>> {
    return apiService.get<Company[]>('/company');
  }
}

export const companyService = new CompanyService();
