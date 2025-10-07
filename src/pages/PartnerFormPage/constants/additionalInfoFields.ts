import type { AdditionalInfo } from 'src/types/partner';

export interface AdditionalInfoFieldConfig {
  key: keyof AdditionalInfo;
  label: string;
  caption: string;
  hint: string;
}

export const ADDITIONAL_INFO_FIELDS: Record<keyof AdditionalInfo, AdditionalInfoFieldConfig> = {
  mainProducts: {
    key: 'mainProducts',
    label: 'Produtos/Serviços Mais Importantes',
    caption: 'Principais ofertas do parceiro',
    hint: 'Descreva os produtos ou serviços mais relevantes',
  },
  uniqueProduct: {
    key: 'uniqueProduct',
    label: 'Produto/Serviço Único',
    caption: 'Diferencial competitivo',
    hint: 'Descreva o diferencial único do parceiro',
  },
  idealClient: {
    key: 'idealClient',
    label: 'Cliente Ideal',
    caption: 'Perfil do cliente ideal para indicação',
    hint: 'Descreva o perfil do cliente ideal para este parceiro',
  },
  conversationStarter: {
    key: 'conversationStarter',
    label: 'Como Iniciar Conversa',
    caption: 'Melhores formas de abordar sobre a empresa',
    hint: 'Descreva como iniciar uma conversa sobre este parceiro',
  },
};
