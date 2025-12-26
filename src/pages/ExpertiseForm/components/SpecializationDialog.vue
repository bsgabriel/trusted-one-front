<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card style="min-width: 400px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Nova Especialização</div>
        <q-space />
        <q-btn icon="close" flat round dense @click="onDialogCancel" />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="name"
          label="Nome da Especialização *"
          outlined
          autofocus
          :rules="[(val) => !!val || 'Nome é obrigatório']"
          @keyup.enter="onOKClick"
        />
      </q-card-section>

      <q-card-actions align="right">
        <q-btn flat label="Cancelar" color="grey-7" @click="onDialogCancel" />
        <q-btn unelevated label="Adicionar" color="primary" @click="onOKClick" :disable="!name" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useDialogPluginComponent } from 'quasar';

const { onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent();

const name = ref('');

const onOKClick = () => {
  if (name.value.trim()) {
    onDialogOK(name.value.trim());
  }
};
</script>
