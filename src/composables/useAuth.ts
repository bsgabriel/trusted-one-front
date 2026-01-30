import { ref, computed, readonly } from 'vue';
import { userService } from '../services/userService';
import type { AccountCreationDto, UserDto } from 'src/types/user';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from '../composables/useAppRouter';
import { useApiError } from 'src/composables/useApiError';
import { apiService } from '../services/apiUtils';

const currentUser = ref<UserDto | null>(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useAuth() {
  const { navigate } = useAppRouter();
  const { notifyError } = useApiError();

  const isAuthenticated = computed(() => !!currentUser.value);

  const checkAuth = async (): Promise<boolean> => {
    if (isInitialized.value) {
      return isAuthenticated.value;
    }

    const token = apiService.getToken();
    if (!token) {
      isInitialized.value = true;
      return false;
    }

    isLoading.value = true;

    try {
      currentUser.value = await userService.getProfile();
      return true;
    } catch {
      apiService.clearToken();
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
      const response = await userService.login({ email, password });
      apiService.setToken(response.token);
      currentUser.value = await userService.getProfile();

      return { success: true };
    } catch (error) {
      notifyError(error);
      return { success: false };
    } finally {
      isLoading.value = false;
    }
  };

  const logout = (): void => {
    apiService.clearToken();
    currentUser.value = null;
    navigate(PAGES.LOGIN);
  };

  const handleSessionExpired = (): void => {
    if (!isAuthenticated.value) {
      return;
    }

    apiService.clearToken();
    currentUser.value = null;
    isInitialized.value = false;
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
