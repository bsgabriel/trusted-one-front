import type { ContactMethodType } from 'src/types/contactMethod';
import type { BusinessProfileCategory, GainsCategory } from 'src/types/partner';

export interface GroupForm {
  groupId?: number;
  name: string;
  isNew?: boolean;
}

export interface CompanyForm {
  companyId?: number;
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
  type: ContactMethodType | '';
  info: string;
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
}

export interface GainsProfileForm {
  gainsProfileId?: number;
  category: GainsCategory;
  info: string;
}

export interface BusinessProfileForm {
  businessProfileId?: number;
  category: BusinessProfileCategory;
  info: string;
}

export interface PartnerForm {
  partnerId?: number;
  basicData: BasicDataForm;
  contactMethods: ContactMethodForm[];
  expertises: ExpertiseForm[];
  gainsProfile: GainsProfileForm[];
  businessProfile: BusinessProfileForm[];
}
