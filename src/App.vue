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
import { onMounted, computed } from 'vue';
import { useAuth } from './composables/useAuth';

const { checkAuth, isInitialized } = useAuth();

const showInitLoading = computed(() => !isInitialized.value);

onMounted(async () => {
  await checkAuth();
});
</script>
