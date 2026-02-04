<template>
  <div class="auth-page flex flex-center">
    <div class="auth-container">
      <div class="auth-header text-center q-mb-xl">
        <div class="text-h4 text-weight-bold text-primary q-mb-md">Agenda Profissional</div>
        <div class="text-subtitle1">Sua lista de recomendação de profissionais</div>
      </div>
      <PasswordResetForm v-if="isPasswordResetPage" />
      <AuthForm v-else />
    </div>

    <div class="auth-background">
      <div class="bg-shape-1"></div>
      <div class="bg-shape-2"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from 'src/composables/useAuth';
import AuthForm from './components/AuthForm.vue';
import PasswordResetForm from './components/PasswordResetForm.vue';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from 'src/composables/useAppRouter';

const route = useRoute();
const { isAuthenticated } = useAuth();
const { navigate } = useAppRouter();
const isPasswordResetPage = computed(() => route.path === PAGES.PASSWORD_RESET.path);

onMounted(() => {
  if (isAuthenticated.value && !isPasswordResetPage.value) {
    navigate(PAGES.DASHBOARD);
  }
});
</script>

<style scoped lang="scss">
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, $primary 0%, $secondary 100%);
  position: relative;
  overflow: hidden;
}

.auth-container {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 500px;
  padding: 32px 16px;
}

.auth-header {
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.auth-header .text-primary {
  color: white !important;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.bg-shape-1,
.bg-shape-2 {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
}

.bg-shape-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -150px;
  animation: float 6s ease-in-out infinite;
}

.bg-shape-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -100px;
  animation: float 8s ease-in-out infinite reverse;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

@media (max-width: 600px) {
  .auth-container {
    padding: 16px;
  }

  .auth-header .text-h4 {
    font-size: 1.5rem;
  }

  .bg-shape-1 {
    width: 200px;
    height: 200px;
    top: -100px;
    right: -100px;
  }

  .bg-shape-2 {
    width: 150px;
    height: 150px;
    bottom: -75px;
    left: -75px;
  }
}
</style>
