export type ContactMethodType =
  | 'email'
  | 'phone'
  | 'whatsapp'
  | 'linkedin'
  | 'instagram'
  | 'website'
  | 'other';

export interface ContactMethod {
  type: ContactMethodType | '';
  value: string;
}
