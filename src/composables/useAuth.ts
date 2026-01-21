import { ref, computed, readonly } from 'vue';
import { userService } from '../services/userService';
import type { AccountCreationDto, UserDto } from 'src/types/user';
import { useNotification } from './useNotification';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from '../composables/useAppRouter';
import { useApiError } from 'src/composables/useApiError';

const currentUser = ref<UserDto | null>(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useAuth() {
  const { showError } = useNotification();
  const { navigate } = useAppRouter();
  const { notifyError } = useApiError();
  
  const isAuthenticated = computed(() => !!currentUser.value);

  const checkAuth = async (): Promise<boolean> => {
    if (isInitialized.value) {
      return isAuthenticated.value;
    }

    isLoading.value = true;

    try {
      currentUser.value = await userService.getProfile();
      return true;
    } catch {
      currentUser.value = null;
      return false;
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };

  const register = async (userData: AccountCreationDto) => {
    isLoading.value = true;

    try {
      await userService.createAccount(userData);
      return await login(userData.email, userData.password);
    } catch (error) {
      notifyError(error);
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      await userService.login({ email, password });
      currentUser.value = await userService.getProfile();
      return { success: true };
    } catch (error) {
      notifyError(error);
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = async (): Promise<void> => {
    isLoading.value = true;

    try {
      await userService.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      currentUser.value = null;
      isLoading.value = false;
      navigate(PAGES.LOGIN);
    }
  };

  const handleSessionExpired = (): void => {
    if (!isAuthenticated.value) {
      return;
    }

    currentUser.value = null;
    isInitialized.value = false;
    showError('Sua sessão expirou. Por favor, faça login novamente.');
    navigate(PAGES.LOGIN);
  };

  return {
    currentUser: readonly(currentUser),
    isLoading: readonly(isLoading),
    isInitialized: readonly(isInitialized),
    isAuthenticated,
    checkAuth,
    login,
    logout,
    register,
    handleSessionExpired,
  };
}
