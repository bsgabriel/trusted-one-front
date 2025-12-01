import { apiService } from './apiUtils';
import type { Group } from 'src/types/group';

export class GroupService {
  async getGroups(): Promise<Group[]> {
    return apiService.get<Group[]>('/group');
  }
}

export const groupService = new GroupService();
