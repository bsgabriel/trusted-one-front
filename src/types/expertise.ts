export interface ExpertiseListing {
  expertiseId?: number;
  parentExpertiseId?: number;
  name: string;
}

export interface Expertise {
  expertiseId?: number;
  name: string;
  parentExpertiseId?: number;
  parentExpertiseName?: string;
  availableForReferral: boolean;
}
