<template>
  <q-page class="q-pa-md">
    <div class="row q-mb-lg">
      <div class="col">
        <h4 class="text-h4 q-my-md">
          <q-icon name="person" class="q-mr-sm" />
          Contatos
        </h4>
        <p class="text-subtitle1 text-grey-7">Gerencie sua lista de contatos profissionais</p>
      </div>
      <div class="col-auto">
        <q-btn color="primary" icon="add" label="Novo Contato" @click="showAddContact" />
      </div>
    </div>

    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">Lista de Contatos</div>
        <div class="text-caption text-grey-6">
          Aqui você pode visualizar e gerenciar seus contatos
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <div class="text-center q-py-lg">
          <q-icon name="person_add" size="4rem" color="grey-5" />
          <div class="text-h6 q-mt-md text-grey-6">Nenhum contato encontrado</div>
          <div class="text-body2 text-grey-5 q-mt-sm">Clique em "Novo Contato" para começar</div>
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';

const $q = useQuasar();

const showAddContact = () => {
  $q.notify({
    message: 'Funcionalidade em desenvolvimento!',
    color: 'info',
    icon: 'info',
  });
};
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}
</style>
