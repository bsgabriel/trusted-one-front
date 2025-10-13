import type { ContactMethodType } from 'src/types/contactMethod';
import type { BusinessProfileCategory, GainsCategory } from 'src/types/partner';

export interface GroupForm {
  groupId: number | null;
  name: string;
  isNew?: boolean;
}

export interface CompanyForm {
  companyId: number | null;
  name: string;
  isNew?: boolean;
}

export interface BasicDataForm {
  name: string;
  group?: GroupForm;
  company?: CompanyForm;
}

export interface ContactMethodForm {
  contactMethodId?: number;
  type: ContactMethodType;
  value?: string;
}

export interface ExpertiseItem {
  expertiseId?: number;
  parentExpertiseId?: number;
  name: string;
  isNew: boolean;
}

export interface ExpertiseForm {
  expertise?: ExpertiseItem;
  subexpertise?: ExpertiseItem;
  availableForReferral: boolean;
  expertiseOptions: ExpertiseItem[];
  subexpertiseOptions: ExpertiseItem[];
  filteredSubexpertiseOptions: ExpertiseItem[];
}

export interface GainsProfileForm {
  gainsProfileId?: number;
  category: GainsCategory;
  value: string;
}

export interface BusinessProfileForm {
  businessProfileId?: number;
  category: BusinessProfileCategory;
  value: string;
}

export interface PartnerForm {
  basicData: BasicDataForm;
  contactMethods: ContactMethodForm[];
  expertises: ExpertiseForm[];
  gainsProfile: GainsProfileForm[];
  businessProfile: BusinessProfileForm[];
}
