export interface MenuOption {
  id: string;
  icon: string;
  description: string;
}

export const menuOptions: MenuOption[] = [
  {
    id: 'contact-list',
    icon: 'person',
    description: 'Contatos',
  },
  {
    id: 'group-list',
    icon: 'groups',
    description: 'Grupos',
  },
  {
    id: 'company-list',
    icon: 'domain',
    description: 'Empresas',
  },
  {
    id: 'job-list',
    icon: 'work',
    description: 'Profissões',
  },
];
