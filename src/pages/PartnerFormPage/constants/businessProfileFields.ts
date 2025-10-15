import { BusinessProfileCategory } from 'src/types/partner';

export interface BusinessProfileFieldConfig {
  category: BusinessProfileCategory;
  label: string;
  caption: string;
  hint: string;
  fieldCaption: string;
}

export const BUSINESS_PROFILE_FIELDS: BusinessProfileFieldConfig[] = [
  {
    category: BusinessProfileCategory.CORE_PRODUCTS_SERVICES,
    label: 'Produtos/Serviços Mais Importantes',
    caption: 'Principais ofertas do parceiro',
    hint: 'Descreva os produtos ou serviços mais relevantes',
    fieldCaption: 'Produto/Serviço',
  },
  {
    category: BusinessProfileCategory.UNIQUE_VALUE_PROPOSITION,
    label: 'Produto/Serviço Único',
    caption: 'Diferencial competitivo',
    hint: 'Descreva o diferencial único do parceiro',
    fieldCaption: 'Produto/Serviço',
  },
  {
    category: BusinessProfileCategory.TARGET_CLIENT_PROFILE,
    label: 'Cliente Ideal',
    caption: 'Perfil do cliente ideal para indicação',
    hint: 'Descreva o perfil do cliente ideal para este parceiro',
    fieldCaption: 'Cliente',
  },
  {
    category: BusinessProfileCategory.CONVERSATION_STARTER,
    label: 'Como Iniciar Conversa',
    caption: 'Melhores formas de abordar sobre a empresa',
    hint: 'Descreva como iniciar uma conversa sobre este parceiro',
    fieldCaption: 'Abordagem',
  },
];
