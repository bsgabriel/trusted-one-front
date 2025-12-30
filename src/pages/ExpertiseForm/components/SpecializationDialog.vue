<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 500px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Adicionar Especializações</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-input
          v-model="newSpecializationName"
          label="Nome da Especialização"
          outlined
          hint="Digite o nome e pressione Enter ou clique em Adicionar"
          @keyup.enter="addSpecialization"
          clearable
        >
          <template v-slot:append>
            <q-btn
              icon="add"
              flat
              round
              dense
              color="primary"
              :disable="!newSpecializationName.trim()"
              @click="addSpecialization"
            />
          </template>
        </q-input>

        <!-- Lista de Especializações Adicionadas -->
        <div v-if="selectedSpecializations.length > 0" class="q-mt-md">
          <div class="text-subtitle2 text-grey-7 q-mb-sm">
            {{ selectedSpecializations.length }} especialização{{
              selectedSpecializations.length === 1 ? '' : 'ões'
            }}
            adicionada{{ selectedSpecializations.length === 1 ? '' : 's' }}
          </div>

          <q-list bordered separator>
            <q-item v-for="(spec, index) in selectedSpecializations" :key="index">
              <q-item-section>
                <q-item-label>{{ spec.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn icon="close" flat round dense @click="removeFromSelection(index)" />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-else class="text-center text-grey-7 q-mt-md q-pa-md">
          Digite o nome da especialização e adicione à lista
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn label="Cancelar" color="grey-7" flat v-close-popup />
        <q-btn
          label="Adicionar"
          color="primary"
          unelevated
          :disable="selectedSpecializations.length === 0"
          @click="confirmSelection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { SpecializationListItem } from '../types/formData';
import { ref, watch } from 'vue';

interface Props {
  modelValue: boolean;
  excludeSpecializationIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  excludeSpecializationIds: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [specializations: SpecializationListItem[]];
}>();

const newSpecializationName = ref('');
const selectedSpecializations = ref<SpecializationListItem[]>([]);
let nextTempId = -1;

const addSpecialization = () => {
  const name = newSpecializationName.value.trim();

  if (!name) {
    return;
  }

  const alreadyAdded = selectedSpecializations.value.some(
    (spec) => spec.name.toLowerCase() === name.toLowerCase(),
  );

  if (alreadyAdded) {
    return;
  }

  selectedSpecializations.value.push({
    expertiseId: nextTempId--,
    name: name,
  });

  newSpecializationName.value = '';
};

const removeFromSelection = (index: number) => {
  selectedSpecializations.value.splice(index, 1);
};

const confirmSelection = () => {
  emit('confirm', [...selectedSpecializations.value]);
  selectedSpecializations.value = [];
  newSpecializationName.value = '';
  nextTempId = -1;
  emit('update:modelValue', false);
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      selectedSpecializations.value = [];
      newSpecializationName.value = '';
      nextTempId = -1;
    }
  },
);
</script>
