export interface CompanyForm {
  companyId?: number;
  name: string;
  partners: CompanyPartnerForm[];
}

export interface CompanyPartnerForm {
  partnerId: number;
  name: string;
}
