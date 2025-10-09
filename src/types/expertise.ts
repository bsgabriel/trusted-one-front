export interface ExpertiseListing {
  expertiseId?: number | undefined;
  parentExpertiseId?: number | undefined;
  name: string;
  isNew: boolean;
}

export interface ExpertiseItem {
  expertise: ExpertiseListing | null;
  subexpertise?: ExpertiseListing | null;
  availableForReferral: boolean;
  expertiseOptions: ExpertiseListing[];
  subexpertiseOptions: ExpertiseListing[];
  filteredSubexpertiseOptions: ExpertiseListing[];
}
