<template>
  <div id="q-app">
    <router-view />

    <!-- Loading global quando inicializando auth -->
    <q-dialog v-model="showInitLoading" persistent>
      <q-card class="flex flex-center q-pa-lg">
        <q-spinner-dots size="50px" color="primary" />
        <div class="q-ml-md">Carregando...</div>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed, onUnmounted } from 'vue';
import { useAuth } from './composables/useAuth';
import { useRouter } from 'vue-router';
import { useNotification } from './composables/useNotification';

const { checkAuth, isInitialized } = useAuth();
const showInitLoading = computed(() => !isInitialized.value);
const router = useRouter();
const { showError } = useNotification();

const handleSessionExpired = () => {
  showError('Sua sessão expirou. Por favor, faça login novamente.');
  void useAuth()
    .logout()
    .then(() => void router.push({ name: 'login' }));
};

onMounted(() => {
  window.addEventListener('session-expired', handleSessionExpired);
  checkAuth();
});

onUnmounted(() => {
  window.removeEventListener('session-expired', handleSessionExpired);
});
</script>
