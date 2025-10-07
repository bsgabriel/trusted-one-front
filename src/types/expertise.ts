export interface Specialization {
  specializationId: string | null;
  name: string;
  isNew?: boolean;
}

export interface Subspecialization {
  subspecializationId: string | null;
  name: string;
  isNew?: boolean;
}

export interface ExpertiseItem {
  specialization: Specialization | null;
  subspecialization: Subspecialization | null;
  availableForReferral: boolean;
  specializationOptions?: Specialization[];
  subspecializationOptions?: Subspecialization[];
}
