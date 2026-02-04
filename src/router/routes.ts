import type { RouteRecordRaw } from 'vue-router';
import { PAGES } from 'src/constants/pages';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: PAGES.DASHBOARD.path,
        name: PAGES.DASHBOARD.id,
        component: () => import('pages/Dashboard/DashboardPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.REFERRAL.path,
        name: PAGES.REFERRAL.id,
        component: () => import('pages/Referral/ReferralPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.REFERRAL_HISTORY.path,
        name: PAGES.REFERRAL_HISTORY.id,
        component: () => import('pages/ReferralHistory/ReferralHistory.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.PARTNERS.path,
        name: PAGES.PARTNERS.id,
        component: () => import('pages/PartnerListing/PartnerListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.CREATE_PARTNER.path,
        name: PAGES.CREATE_PARTNER.id,
        component: () => import('pages/PartnerFormPage/PartnerFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EDIT_PARTNER.path,
        name: PAGES.EDIT_PARTNER.id,
        component: () => import('pages/PartnerFormPage/PartnerFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.GROUPS.path,
        name: PAGES.GROUPS.id,
        component: () => import('pages/GroupListing/GroupListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.CREATE_GROUP.path,
        name: PAGES.CREATE_GROUP.id,
        component: () => import('pages/GroupForm/GroupFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EDIT_GROUP.path,
        name: PAGES.EDIT_GROUP.id,
        component: () => import('pages/GroupForm/GroupFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.COMPANIES.path,
        name: PAGES.COMPANIES.id,
        component: () => import('pages/CompanyListing/CompanyListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.CREATE_COMPANY.path,
        name: PAGES.CREATE_COMPANY.id,
        component: () => import('pages/CompanyForm/CompanyFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EDIT_COMPANY.path,
        name: PAGES.EDIT_COMPANY.id,
        component: () => import('pages/CompanyForm/CompanyFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EXPERTISES.path,
        name: PAGES.EXPERTISES.id,
        component: () => import('pages/ExpertiseListing/ExpertiseListingPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.CREATE_EXPERTISE.path,
        name: PAGES.CREATE_EXPERTISE.id,
        component: () => import('pages/ExpertiseForm/ExpertiseFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EDIT_EXPERTISE.path,
        name: PAGES.EDIT_EXPERTISE.id,
        component: () => import('pages/ExpertiseForm/ExpertiseFormPage.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: PAGES.EDIT_SPECIALIZATION.path,
        name: PAGES.EDIT_SPECIALIZATION.id,
        component: () => import('pages/SpecializationForm/SpecializationFormPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: PAGES.LOGIN.path,
    name: PAGES.LOGIN.id,
    component: () => import('pages/Auth/AuthPage.vue'),
  },
  {
    path: PAGES.PASSWORD_RESET.path,
    name: PAGES.PASSWORD_RESET.id,
    component: () => import('pages/Auth/AuthPage.vue'),
  },
  // Página 404
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
