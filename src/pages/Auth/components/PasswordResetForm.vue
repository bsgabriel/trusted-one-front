<template>
  <q-card class="auth-card">
    <q-card-section class="text-center q-pb-none">
      <div class="text-h5 text-weight-bold q-mb-md">Redefinir Senha</div>
      <div class="text-subtitle2 text-grey-7">Digite sua nova senha</div>
    </q-card-section>

    <q-card-section class="q-pa-lg">
      <div v-if="isValidating" class="text-center q-py-xl">
        <q-spinner color="primary" size="50px" />
        <div class="text-subtitle2 text-grey-7 q-mt-md">Validando token...</div>
      </div>

      <div v-else-if="!isValid" class="text-center q-py-lg">
        <q-icon name="error" color="negative" size="64px" class="q-mb-md" />
        <div class="text-h6 text-negative q-mb-md">Token Inválido</div>
        <div class="text-body2 text-grey-7 q-mb-lg">
          O link de redefinição de senha expirou ou é inválido.
        </div>
      </div>

      <q-form v-else @submit="handleSubmit" class="auth-form">
        <BaseInput
          v-model="formData.password"
          label="Nova senha"
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
          v-model="formData.confirmPassword"
          label="Confirmar nova senha"
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

        <BaseButton
          label="Redefinir Senha"
          type="submit"
          color="primary"
          :loading="isSubmitting"
          full-width
          class="q-mb-md"
        />
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useNotification } from 'src/composables/useNotification';
import { userService } from 'src/services/userService';
import BaseInput from 'src/components/BaseInput.vue';
import BaseButton from 'src/components/BaseButton.vue';

const route = useRoute();
const { showSuccess, showError } = useNotification();

interface FormData {
  password: string;
  confirmPassword: string;
}

const isValidating = ref(true);
const isValid = ref(false);
const isSubmitting = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const token = ref('');

const formData = reactive<FormData>({
  password: '',
  confirmPassword: '',
});

const passwordRules = [
  (val: string) => (val && val.length > 0) || 'Senha é obrigatória',
  (val: string) => (val && val.length >= 8) || 'Senha deve ter pelo menos 8 caracteres',
];

const confirmPasswordRules = [
  (val: string) => (val && val.length > 0) || 'Confirmação de senha é obrigatória',
  (val: string) => val === formData.password || 'As senhas não conferem',
];

const validateToken = () => {
  const tokenParam = route.query.token as string;

  if (!tokenParam) {
    showError('Token de redefinição não fornecido.');
    isValid.value = false;
    isValidating.value = false;
    return;
  }

  token.value = tokenParam;

  userService
    .validateResetToken(token.value)
    .then(() => (isValid.value = true))
    .catch(() => (isValid.value = false))
    .finally(() => (isValidating.value = false));
};

const handleSubmit = () => {
  isSubmitting.value = true;

  userService
    .resetPassword({
      token: token.value,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    })
    .then(() => {
      showSuccess('Senha redefinida com sucesso! Você pode fechar esta aba e fazer login.');
      setTimeout(() => {
        window.close();
      }, 3000);
    })
    .catch(() => (isValid.value = false))
    .finally(() => (isSubmitting.value = false));
};

onMounted(() => {
  validateToken();
});
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
