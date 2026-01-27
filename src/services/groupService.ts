import { apiService } from './apiUtils';
import type { Group, GroupFormRequest, GroupListing, GroupListParams } from 'src/types/group';
import type { PageResponse } from 'src/types/pageable';

export class GroupService {
  async listGroups(params: GroupListParams): Promise<PageResponse<GroupListing>> {
    const queryParams = new URLSearchParams();
    if (params.search) {
      queryParams.append('search', params.search);
    }

    return apiService.get<PageResponse<GroupListing>>(`/group?${queryParams.toString()}`);
  }

  async fetchGroup(groupId: number): Promise<Group> {
    return apiService.get<Group>(`/group/${groupId}`);
  }

  async createGroup(group: GroupFormRequest): Promise<Group> {
    return apiService.post<Group>('/group', group);
  }

  async updateGroup(group: GroupFormRequest): Promise<Group> {
    return apiService.put<Group>(`/group/${group.groupId}`, group);
  }

  async deleteGroup(groupId: number): Promise<void> {
    return apiService.delete<void>(`/group/${groupId}`);
  }
}

export const groupService = new GroupService();
