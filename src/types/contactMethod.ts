export type ContactMethodType =
  | 'EMAIL'
  | 'PHONE'
  | 'LINKEDIN'
  | 'OTHER'

export interface ContactMethod {
  contactMethodId?: number;
  type: ContactMethodType | '';
  info: string;
}
