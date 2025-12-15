export interface GroupForm {
  groupId?: number;
  name: string;
  description?: string;
  partners: GroupPartnerForm[];
}

export interface GroupPartnerForm {
  partnerId: number;
  name: string;
}