export interface MenuOption {
  id: string;
  icon: string;
  description: string;
  route: string;
}

export const menuOptions: MenuOption[] = [
  {
    id: 'dashboard',
    icon: 'show_chart',
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
    icon: 'person',
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
    id: 'listagem-especializacoes',
    icon: 'work',
    description: 'Especializações',
    route: '/especializacoes',
  },
];
