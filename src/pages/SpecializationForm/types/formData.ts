export interface SpecializationForm {
  expertiseId?: number;
  name: string;
  parentExpertiseId: number;
  parentExpertiseName?: string;
  partners: SpecializationPartnerForm[];
}

export interface SpecializationPartnerForm {
  partnerId: number;
  name: string;
  availableForReferral: boolean;
}
