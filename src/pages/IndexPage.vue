<template>
  <q-page class="flex flex-center">
    <div class="text-center">
      <q-icon name="waving_hand" size="4rem" color="primary" class="q-mb-md" />

      <h3 class="text-h3 q-mt-md q-mb-md">Bem-vindo!</h3>

      <p class="text-subtitle1 text-grey-7">Você está logado na Agenda Profissional</p>

      <div class="q-mt-lg">
        <q-btn
          color="primary"
          label="Página funcionando!"
          icon="check_circle"
          size="lg"
          @click="showSuccess"
        />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const showSuccess = () => {
  $q.notify({
    message: 'Tudo funcionando perfeitamente! 🎉',
    color: 'positive',
    icon: 'celebration',
  });
};
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}
</style>
