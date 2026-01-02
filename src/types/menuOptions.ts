export interface MenuOption {
  id: string;
  icon: string;
  description: string;
  route: string;
}

export const menuOptions: MenuOption[] = [
  {
    id: 'dashboard',
    icon: 'dashboard',
    description: 'Indicadores',
    route: '/'
  },
  {
    id: 'indicar-parceiro',
    icon: 'handshake',
    description: 'Indicar Parceiro',
    route: '/indicar',
  },
  { 
    id: 'historico-indicacoes',
    icon: 'history',
    description: 'Histórico de Indicações',
    route: '/historico'
  },
  {
    id: 'listagem-parceiros',
    icon: 'people',
    description: 'Parceiros',
    route: '/parceiros',
  },
  {
    id: 'listagem-grupos',
    icon: 'groups',
    description: 'Grupos',
    route: '/grupos',
  },
  {
    id: 'listagem-empresas',
    icon: 'domain',
    description: 'Empresas',
    route: '/empresas',
  },
  {
    id: 'listagem-areas-atuacao',
    icon: 'work',
    description: 'Áreas de Atuação',
    route: '/especializacoes', // TODO: trocar para /areas-atuacao
  },
];
