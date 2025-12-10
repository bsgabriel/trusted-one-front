import { apiService } from './apiUtils';
import type { Group, GroupFormRequest, GroupListing, GroupListParams } from 'src/types/group';
import type { PageResponse } from 'src/types/pageable';

export class GroupService {
  async getGroups(): Promise<Group[]> {
    return apiService.get<Group[]>('/group');
  }

  async listGroups(params: GroupListParams): Promise<PageResponse<GroupListing>> {
    const queryParams = new URLSearchParams();
    if (params.search) {
      queryParams.append('search', params.search);
    }

    return apiService.get<PageResponse<GroupListing>>(`/group/listing?${queryParams.toString()}`);
  }

  async fetchGroupById(groupId: number): Promise<Group> {
    return apiService.get<Group>(`/group/${groupId}`);
  }

  async deleteGroup(groupId: number): Promise<void> {
    return apiService.delete<void>(`/group/${groupId}`);
  }

  async updateGroup(group: GroupFormRequest): Promise<Group> {
    return apiService.put<Group>(`/group/${group.groupId}`, group);
  }

  async createGroup(group: GroupFormRequest): Promise<Group> {
    return apiService.post<Group>('/group', group);
  }
}

export const groupService = new GroupService();
