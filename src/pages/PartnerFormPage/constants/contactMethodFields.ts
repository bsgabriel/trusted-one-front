import type { ContactMethodType } from 'src/types/contactMethod';

interface ContactTypeConfig {
  value: ContactMethodType;
  label: string;
  icon: string;
  inputLabel: string;
  validate: (value: string) => boolean;
}

export const DEFAULT_CONTACT_CONFIG: ContactTypeConfig = {
  value: 'OTHER',
  label: 'Outro',
  icon: 'contact_page',
  inputLabel: 'Valor *',
  validate: (val) => val.length > 0,
};

export const contactTypeConfigs: Record<ContactMethodType, ContactTypeConfig> = {
  EMAIL: {
    value: 'EMAIL',
    label: 'E-mail',
    icon: 'email',
    inputLabel: 'E-mail *',
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  },
  PHONE: {
    value: 'PHONE',
    label: 'Telefone',
    icon: 'phone',
    inputLabel: 'Telefone *',
    validate: (val) => /^\+?[\d\s()-]{8,}$/.test(val),
  },
  LINKEDIN: {
    value: 'LINKEDIN',
    label: 'LinkedIn',
    icon: 'work',
    inputLabel: 'URL do LinkedIn *',
    validate: (val) => /^https?:\/\/.+/.test(val) || /^www\..+/.test(val),
  },
  OTHER: DEFAULT_CONTACT_CONFIG,
};
