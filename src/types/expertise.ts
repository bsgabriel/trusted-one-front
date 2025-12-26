import type { BasePageableParams } from './pageable';

export interface ExpertiseFormRequest {
  name: string;
  specializations: SpecializationFormRequest[];
}

export interface SpecializationFormRequest {
  name: string;
  parentExpertiseId: number;
  partners: PartnerExpertiseForm[];
}

export interface PartnerExpertiseForm {
  partnerId: number;
  availableForReferral: boolean;
}

export interface Expertise {
  expertiseId: number;
  name: string;
  specializations: Specialization[];
}

export interface Specialization {
  expertiseId: number;
  name: string;
  parentExpertiseId: number;
  parentExpertiseName: string;
  partners: PartnerExpertise[];
}

export interface PartnerExpertise {
  partnerExpertiseId?: number; // TODO: validar se precisa ser opcional
  partnerId: number;
  partnerName: string;
  availableForReferral: boolean;
}

export interface ExpertiseListing {
  expertiseId: number;
  name: string;
  specializationCount: number;
}

export interface SpecializationListing {
  parentExpertiseId: number;
  expertiseId: number;
  name: string;
  partnerCount: number;
}

export interface ExpertiseListParams extends BasePageableParams {
  search?: string;
}

export interface AssignedExpertise {
  expertiseId?: number;
  name: string;
  parentExpertiseId?: number;
  parentExpertiseName?: string;
  availableForReferral: boolean;
}
