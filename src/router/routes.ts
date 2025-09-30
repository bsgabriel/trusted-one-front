import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Indicadores',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'historico',
        name: 'Histórico',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'parceiros',
        name: 'Parceiros',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'grupos',
        name: 'Grupos',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'empresas',
        name: 'Empresas',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'especializacoes',
        name: 'Especializações',
        component: () => import('pages/IndexPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('pages/AuthPage.vue'),
  },
  // Página 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
