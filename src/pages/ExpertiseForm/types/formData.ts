export interface ExpertiseForm {
  expertiseId?: number;
  name: string;
  specializations: SpecializationListItem[];
}

export interface SpecializationListItem {
  expertiseId: number;
  name: string;
  partnerCount: number;
}
