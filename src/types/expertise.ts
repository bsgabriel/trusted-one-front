export interface ExpertiseListing {
  expertiseId?: number | undefined;
  parentExpertiseId?: number | undefined;
  name: string;
  isNew: boolean;
}

export interface ExpertiseItem {
  specialization: ExpertiseListing | null;
  subspecialization?: ExpertiseListing | null;
  availableForReferral: boolean;
  specializationOptions: ExpertiseListing[];
  subspecializationOptions: ExpertiseListing[];
  filteredSubspecializationOptions: ExpertiseListing[];
}
