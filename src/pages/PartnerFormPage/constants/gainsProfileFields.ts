import { GainsCategory } from 'src/types/partner';

export interface GainsFieldConfig {
  category: GainsCategory;
  label: string;
  caption: string;
  hint: string;
  fieldCaption: string;
}

export const GAIN_PROFILE_FIELDS: GainsFieldConfig[] = [
  {
    category: GainsCategory.GOAL,
    label: 'Goals (Objetivos)',
    caption: 'Objetivos e metas do parceiro',
    hint: 'Descreva os principais objetivos profissionais',
    fieldCaption: 'Objetivo',
  },
  {
    category: GainsCategory.ACCOMPLISHMENT,
    label: 'Accomplishments (Realizações)',
    caption: 'Principais realizações e conquistas',
    hint: 'Descreva as principais conquistas profissionais',
    fieldCaption: 'Realização',
  },
  {
    category: GainsCategory.INTEREST,
    label: 'Interests (Interesses)',
    caption: 'Áreas de interesse profissional',
    hint: 'Descreva os principais interesses profissionais',
    fieldCaption: 'Interesse',
  },
  {
    category: GainsCategory.NETWORK,
    label: 'Networks (Conexões)',
    caption: 'Rede de contatos e conexões profissionais',
    hint: 'Descreva as principais redes e conexões relevantes',
    fieldCaption: 'Conexão',
  },
  {
    category: GainsCategory.SKILL,
    label: 'Skills (Habilidades)',
    caption: 'Principais habilidades e competências',
    hint: 'Descreva as principais habilidades profissionais',
    fieldCaption: 'Habilidade',
  },
];
