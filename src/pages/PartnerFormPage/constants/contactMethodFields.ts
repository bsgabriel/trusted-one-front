import type { ContactMethodType } from 'src/types/contactMethod';

interface ContactTypeConfig {
  value: ContactMethodType;
  label: string;
  icon: string;
  inputLabel: string;
  validate: (value: string) => boolean;
}

export const DEFAULT_CONTACT_CONFIG: ContactTypeConfig = {
  value: 'other',
  label: 'Outro',
  icon: 'contact_page',
  inputLabel: 'Valor *',
  validate: (val) => val.length > 0,
};

export const contactTypeConfigs: Record<ContactMethodType, ContactTypeConfig> = {
  email: {
    value: 'email',
    label: 'E-mail',
    icon: 'email',
    inputLabel: 'E-mail *',
    validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
  },
  phone: {
    value: 'phone',
    label: 'Telefone',
    icon: 'phone',
    inputLabel: 'Telefone *',
    validate: (val) => /^\+?[\d\s()-]{8,}$/.test(val),
  },
  whatsapp: {
    value: 'whatsapp',
    label: 'WhatsApp',
    icon: 'chat',
    inputLabel: 'WhatsApp *',
    validate: (val) => /^\+?[\d\s()-]{8,}$/.test(val),
  },
  linkedin: {
    value: 'linkedin',
    label: 'LinkedIn',
    icon: 'work',
    inputLabel: 'URL do LinkedIn *',
    validate: (val) => /^https?:\/\/.+/.test(val) || /^www\..+/.test(val),
  },
  instagram: {
    value: 'instagram',
    label: 'Instagram',
    icon: 'photo_camera',
    inputLabel: 'Handle do Instagram *',
    validate: (val) => /^@?[\w.]+$/.test(val),
  },
  website: {
    value: 'website',
    label: 'Website',
    icon: 'language',
    inputLabel: 'URL do Website *',
    validate: (val) => /^https?:\/\/.+/.test(val) || /^www\..+/.test(val),
  },
  other: DEFAULT_CONTACT_CONFIG,
};
