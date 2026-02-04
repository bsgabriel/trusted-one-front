<template>
  <q-card class="auth-card">
    <q-card-section class="text-center q-pb-none">
      <div class="text-h5 text-weight-bold q-mb-md">
        {{ isLogin ? 'Entrar' : 'Criar Conta' }}
      </div>
      <div class="text-subtitle2 text-grey-7">
        {{ isLogin ? 'Acesse sua conta' : 'Crie sua conta para começar' }}
      </div>
    </q-card-section>

    <q-card-section class="q-pa-lg">
      <q-form @submit="handleSubmit" class="auth-form">
        <BaseInput v-if="!isLogin" v-model="formData.name" label="Nome completo" :rules="nameRules">
          <template #prepend>
            <q-icon name="person" />
          </template>
        </BaseInput>

        <BaseInput v-model="formData.email" label="Email" type="email" :rules="emailRules">
          <template #prepend>
            <q-icon name="email" />
          </template>
        </BaseInput>

        <BaseInput
          v-model="formData.password"
          label="Senha"
          :type="showPassword ? 'text' : 'password'"
          :rules="passwordRules"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon
              :name="showPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showPassword = !showPassword"
            />
          </template>
        </BaseInput>

        <BaseInput
          v-if="!isLogin"
          v-model="formData.confirmPassword"
          label="Confirmar senha"
          :type="showConfirmPassword ? 'text' : 'password'"
          :rules="confirmPasswordRules"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
          <template #append>
            <q-icon
              :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
              class="cursor-pointer"
              @click="showConfirmPassword = !showConfirmPassword"
            />
          </template>
        </BaseInput>

        <div v-if="errorMessage" class="text-negative text-center q-mb-md">
          <q-icon name="error" class="q-mr-xs" />
          {{ errorMessage }}
        </div>

        <BaseButton
          :label="isLogin ? 'Entrar' : 'Criar Conta'"
          type="submit"
          color="primary"
          :loading="isLoading"
          full-width
          class="q-mb-md"
        />

        <div class="text-center">
          <q-btn
            v-if="isLogin"
            flat
            no-caps
            color="primary"
            label="Esqueci minha senha"
            @click="requestPasswordChange"
          />
          <q-btn
            flat
            no-caps
            color="primary"
            :label="isLogin ? 'Não tem conta? Criar conta' : 'Já tem conta? Fazer login'"
            @click="toggleMode"
          />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue';
import { useAuth } from 'src/composables/useAuth';
import BaseInput from 'src/components/BaseInput.vue';
import BaseButton from 'src/components/BaseButton.vue';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from 'src/composables/useAppRouter';
import { useNotification } from 'src/composables/useNotification';
import { userService } from 'src/services/userService';

const { showSuccess, showError } = useNotification();

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const { login, register, isLoading } = useAuth();

const isLogin = ref(true);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const errorMessage = ref('');
const { navigate } = useAppRouter();

const formData = reactive<FormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
});

const nameRules = [(val: string) => (val && val.length > 0) || 'Nome é obrigatório'];

const emailRules = [
  (val: string) => (val && val.length > 0) || 'Email é obrigatório',
  (val: string) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(val) || 'Email inválido';
  },
];

const passwordRules = computed(() => [
  (val: string) => (val && val.length > 0) || 'Senha é obrigatória',
  ...(isLogin.value
    ? []
    : [(val: string) => (val && val.length >= 8) || 'Senha deve ter pelo menos 8 caracteres']),
]);

const confirmPasswordRules = [
  (val: string) => (val && val.length > 0) || 'Confirmação de senha é obrigatória',
  (val: string) => val === formData.password || 'As senhas não conferem',
];

const clearMessages = () => {
  errorMessage.value = '';
};

const toggleMode = () => {
  isLogin.value = !isLogin.value;
  clearMessages();

  if (isLogin.value) {
    formData.name = '';
    formData.confirmPassword = '';
  }
};

const requestPasswordChange = () => {
  formData.email = formData.email.trim();
  if (!emailRules.every((rule) => rule(formData.email) === true)) {
    showError('Por favor, insira um email válido para solicitar a redefinição de senha.')
    return;
  }

  userService
    .requestPasswordChange(formData.email)
    .then(() => showSuccess('Instruções para redefinição de senha foram enviadas para seu email.'))
    .catch(() => showError('Erro ao solicitar redefinição de senha. Tente novamente.'));
};

const handleSubmit = async () => {
  clearMessages();

  if (isLogin.value) {
    await login(formData.email, formData.password);
  } else {
    await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
    });
  }
  navigate(PAGES.DASHBOARD);
};
</script>

<style scoped>
.auth-card {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-form {
  width: 100%;
}

@media (max-width: 600px) {
  .auth-card {
    margin: 16px;
    max-width: calc(100% - 32px);
  }
}
</style>
