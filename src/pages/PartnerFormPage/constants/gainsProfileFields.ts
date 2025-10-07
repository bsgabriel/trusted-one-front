import type { GainsProfile } from 'src/types/partner';

export interface GainsFieldConfig {
  key: keyof GainsProfile;
  label: string;
  caption: string;
  hint: string;
}

export const GAIN_PROFILE_FIELDS: Record<keyof GainsProfile, GainsFieldConfig> = {
  goals: {
    key: 'goals',
    label: 'Goals (Objetivos)',
    caption: 'Objetivos e metas do parceiro',
    hint: 'Descreva os principais objetivos profissionais',
  },
  accomplishments: {
    key: 'accomplishments',
    label: 'Accomplishments (Realizações)',
    caption: 'Principais realizações e conquistas',
    hint: 'Descreva as principais conquistas profissionais',
  },
  interests: {
    key: 'interests',
    label: 'Interests (Interesses)',
    caption: 'Áreas de interesse profissional',
    hint: 'Descreva os principais interesses profissionais',
  },
  networks: {
    key: 'interests',
    label: 'Interests (Interesses)',
    caption: 'Áreas de interesse profissional',
    hint: 'Descreva os principais interesses profissionais',
  },
  skills: {
    key: 'skills',
    label: 'Skills (Habilidades)',
    caption: 'Principais habilidades e competências',
    hint: 'Descreva as principais habilidades profissionais',
  },
};
