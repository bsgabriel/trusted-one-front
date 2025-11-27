import { ref, computed, readonly } from 'vue';
import { userService } from '../services/userService';
import type { AccountCreationDto, UserDto } from 'src/types/user';
import { useNotification } from './useNotification';
import { useRouter } from 'vue-router';

const currentUser = ref<UserDto | null>(null);
const isLoading = ref(false);
const isInitialized = ref(false);

export function useAuth() {
  const { showError } = useNotification();
  const router = useRouter();

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
    } catch {
      showError('Erro ao registrar usuário');
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
    } catch {
      showError('Erro ao fazer login. Verifique suas credenciais.');
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
      await router.push({ name: 'login' });
    }
  };

  const handleSessionExpired = (): void => {
    if (!isAuthenticated.value) {
      return;
    }

    currentUser.value = null;
    isInitialized.value = false;
    try {
      showError('Sua sessão expirou. Por favor, faça login novamente.');
    } catch (error) {
      console.log('Porra deu nem pra notificar samerda', error)
    }
    void router.push({ name: 'login' });
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
