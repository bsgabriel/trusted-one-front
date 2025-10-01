import { ref, computed, readonly } from 'vue';
import { userService } from '../services/userService';
import type { AccountCreationDto, UserDto } from 'src/types/user';

const currentUser = ref<UserDto | null>(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useAuth() {
  const isAuthenticated = computed(() => !!currentUser.value);

  const checkAuth = async (): Promise<void> => {
    if (isInitialized.value) return;

    try {
      isLoading.value = true;
      const result = await userService.getProfile();

      if (result.success) {
        currentUser.value = result.data;
      } else {
        currentUser.value = null;
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
      currentUser.value = null;
    } finally {
      isLoading.value = false;
      isInitialized.value = true;
    }
  };

  const register = async (userData: AccountCreationDto) => {
    isLoading.value = true;

    try {
      const result = await userService.createAccount(userData);

      if (result.success) {
        return await login(userData.email, userData.password);
      }

      return {
        success: false,
        message: result.message,
      };
    } finally {
      isLoading.value = false;
    }
  };

  const login = async (email: string, password: string) => {
    isLoading.value = true;

    try {
      const loginResult = await userService.login({ email, password });
      if (!loginResult.success) {
        return {
          success: false,
          message: loginResult.message,
        };
      }

      const profileResult = await userService.getProfile();

      if (profileResult.success) {
        currentUser.value = profileResult.data;
        return { success: true, message: '' };
      } else {
        return {
          success: false,
          message: 'Login realizado, mas erro ao carregar dados do usuário',
        };
      }
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

  const initAuth = async (): Promise<void> => {
    if (!isInitialized.value) {
      await checkAuth();
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
