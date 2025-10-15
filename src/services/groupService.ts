import { apiService } from './apiUtils';
import type { ApiResult } from '../types/api';
import type { Group } from 'src/types/group';

export class GroupService {
  async getGroups(): Promise<ApiResult<Group[]>> {
    return apiService.get<Group[]>('/group');
  }
}

export const groupService = new GroupService();
