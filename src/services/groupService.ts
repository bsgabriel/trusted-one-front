import { apiService } from './apiUtils';
import type { Group, GroupListing, GroupListParams } from 'src/types/group';
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
}

export const groupService = new GroupService();
