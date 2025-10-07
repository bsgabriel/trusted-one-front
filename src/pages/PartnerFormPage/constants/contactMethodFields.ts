import type { ContactMethodType } from 'src/types/contactMethod';

export interface ContactMethodFieldConfig {
  value: ContactMethodType;
  label: string;
}

export const CONTACT_METHOD_OPTIONS: ContactMethodFieldConfig[] = [
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Outro' },
];
