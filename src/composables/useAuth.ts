import { ref, computed, readonly } from 'vue';
import { userService } from '../services/userService';
import type { AccountCreationDto, UserDto } from 'src/types/user';
import { useApiError } from './useApiError';

const currentUser = ref<UserDto | null>(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useAuth() {
  const { notifyError } = useApiError();
  const isAuthenticated = computed(() => !!currentUser.value);

  const checkAuth = () => {
    if (isInitialized.value) {
      return;
    }

    userService
      .getProfile()
      .then((result) => (currentUser.value = result))
      .catch((error) => {
        currentUser.value = null;
        notifyError(error);
      })
      .finally(() => {
        isLoading.value = false;
        isInitialized.value = true;
      });
  };

  const register = async (userData: AccountCreationDto) => {
    isLoading.value = true;

    try {
      await userService.createAccount(userData);
      return await login(userData.email, userData.password);
    } catch (error) {
      notifyError(error);
      return {
        success: false,
        message: 'Erro ao registrar usuário',
      };
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      await userService.login({ email, password });
      currentUser.value = await userService.getProfile();
      return { success: true, message: '' };
    } catch (error) {
      notifyError(error);
      return {
        success: false,
        message: 'Erro ao fazer login. Verifique suas credenciais.',
      };
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
    }
  };

  const initAuth = () => {
    if (!isInitialized.value) {
      checkAuth();
    }
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
    initAuth,
  };
}

// Para uso em eventos globais (como session-expired)
export const authService = {
  logout: () => {
    currentUser.value = null;
  },
};
