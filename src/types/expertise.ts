export interface ExpertiseListing {
  expertiseId?: number | undefined;
  parentExpertiseId?: number | undefined;
  name: string;
}

export interface ExpertiseItem {
  expertise: ExpertiseListing | null;
  subexpertise?: ExpertiseListing | null;
  availableForReferral: boolean;
}
