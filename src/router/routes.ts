import type { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Indicadores',
        component: () => import('pages/Dashboard/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'indicar',
        name: 'Indicar',
        component: () => import('pages/Referral/ReferralPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'historico',
        name: 'Histórico',
        component: () => import('pages/ReferralHistory/ReferralHistory.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'parceiros',
        name: 'partner-listing',
        component: () => import('pages/PartnerListing/PartnerListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'parceiros/novo',
        name: 'partner-creation',
        component: () => import('pages/PartnerFormPage/PartnerFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'parceiros/:id',
        name: 'partner-edit',
        component: () => import('pages/PartnerFormPage/PartnerFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'grupos',
        name: 'Grupos',
        component: () => import('pages/GroupListing/GroupListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'grupos/novo',
        name: 'Cadastro de Grupo',
        component: () => import('pages/GroupForm/GroupFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'grupos/:id',
        name: 'Dados do Grupo',
        component: () => import('pages/GroupForm/GroupFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'empresas',
        name: 'Empresas',
        component: () => import('pages/CompanyListing/CompanyListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'empresas/nova',
        name: 'Cadastro de Empresa',
        component: () => import('pages/CompanyForm/CompanyFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'empresas/:id',
        name: 'Dados da Empresa',
        component: () => import('pages/CompanyForm/CompanyFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'especializacoes',
        name: 'Especializações',
        component: () => import('pages/ExpertiseListing/ExpertiseListingPage.vue'),
        meta: { requiresAuth: true },
      },
            {
        path: 'especializacoes/nova',
        name: 'Cadastro de Especialização',
        component: () => import('pages/ExpertiseForm/ExpertiseFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'especializacoes/:id',
        name: 'Dados da Especialização',
        component: () => import('pages/ExpertiseForm/ExpertiseFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'especializacoes/:expertiseId/subespecializacao/:specializationId',
        name: 'Dados da Subespecialização',
        component: () => import('pages/SpecializationForm/SpecializationFormPage.vue'),
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
