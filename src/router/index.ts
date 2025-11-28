import { route } from 'quasar/wrappers';
import {
  createMemoryHistory,
  createRouter,
  createWebHashHistory,
  createWebHistory,
} from 'vue-router';
import routes from './routes';
import { useAuth } from 'src/composables/useAuth';

export default route(function (/* { store, ssrContext } */) {
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
    const { checkAuth, isAuthenticated, isInitialized } = useAuth();

    if (!isInitialized.value) {
      await checkAuth();
    }

    if (to.meta.requiresAuth && !isAuthenticated.value) {
      return next({ name: 'login' });
    }

    if (to.name === 'login' && isAuthenticated.value) {
      return next({ path: '/' });
    }

    next();
  });

  return Router;
});
