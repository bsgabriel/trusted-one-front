import { defineRouter } from '#q-app/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';

export default defineRouter(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : process.env.VUE_ROUTER_MODE === 'history'
      ? createWebHistory
      : createWebHashHistory;

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE),
  });

  Router.beforeEach(async (to, from, next) => {
    const { useAuth } = await import('../composables/useAuth');
    const { isAuthenticated, checkAuth, isInitialized } = useAuth();

    if (!isInitialized.value) {
      await checkAuth();
    }

    const requiresAuth = to.meta?.requiresAuth;
    const redirectIfAuth = to.meta?.redirectIfAuth;

    if (requiresAuth && !isAuthenticated.value) {
      next({ name: 'login' });
      return;
    }

    if (redirectIfAuth && isAuthenticated.value) {
      next({ name: 'home' });
      return;
    }

    next();
  });

  return Router;
});
