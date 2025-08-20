export interface MenuOption {
  id: string;
  icon: string;
  description: string;
  route: string;
}

export const menuOptions: MenuOption[] = [
  {
    id: 'contact-list',
    icon: 'person',
    description: 'Contatos',
    route: '/contacts',
  },
  {
    id: 'group-list',
    icon: 'groups',
    description: 'Grupos',
    route: '/groups',
  },
  {
    id: 'company-list',
    icon: 'domain',
    description: 'Empresas',
    route: '/companies',
  },
  {
    id: 'job-list',
    icon: 'work',
    description: 'Profissões',
    route: '/jobs',
  },
];
