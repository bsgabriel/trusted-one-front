import type { ContactMethodType } from 'src/types/contactMethod';
import type { GainsCategory } from 'src/types/partner';

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
  category: GainsCategory;
  value: string;
}

export interface BusinessProfileForm {
  mainProducts?: string;
  uniqueProduct?: string;
  idealClient?: string;
  conversationStarter?: string;
}

export interface PartnerForm {
  basicData: BasicDataForm;
  contactMethods: ContactMethodForm[];
  expertises: ExpertiseForm[];
  gainsProfile: GainsProfileForm[];
  businessProfile: BusinessProfileForm;
}
