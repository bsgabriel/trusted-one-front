<!-- Template -->
<template>
  <q-card :class="{ 'border-negative': hasError }">
    <q-card-section>
      <div v-if="expertiseItems.length === 0" class="text-center q-py-md text-grey-6">
        <q-icon name="school" size="3rem" color="grey-4" />
        <div class="q-mt-sm">Nenhuma especialização adicionada</div>
        <div class="text-caption">Adicione pelo menos uma especialização</div>
      </div>

      <div v-else class="q-gutter-md">
        <q-card v-for="(item, index) in expertiseItems" :key="index" flat bordered class="q-pa-md">
          <div class="row q-col-gutter-md items-start">
            <!-- Especialização Principal -->
            <div class="col-12 col-md-5">
              <q-select
                v-model="item.expertise"
                label="Especialização *"
                outlined
                dense
                use-input
                input-debounce="0"
                :options="filteredParentExpertises(index)"
                option-label="name"
                @filter="(val, update) => filterParentExpertises(val, update, index)"
                @update:model-value="onExpertiseChange(index)"
                @input-value="(val) => onParentInputChange(val, index)"
                new-value-mode="add-unique"
                @new-value="(val, done) => createNewExpertise(val, done)"
                :rules="[(val) => !!val || 'Especialização é obrigatória']"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="school" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Digite para buscar ou criar nova especialização
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-icon v-if="item.expertise?.isNew" name="fiber_new" color="positive">
                    <q-tooltip>Nova especialização</q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>

            <!-- Sub-especialização (opcional) -->
            <div class="col-12 col-md-5">
              <q-select
                v-model="item.subexpertise"
                label="Sub-especialização (opcional)"
                outlined
                dense
                use-input
                input-debounce="0"
                :options="getFilteredSubexpertises(index)"
                option-label="name"
                @filter="(val, update) => filterSubexpertises(val, update, index)"
                @input-value="(val) => onSubexpertiseInputChange(val, index)"
                :disable="!item.expertise || item.expertise.isNew"
                new-value-mode="add-unique"
                @new-value="(val, done) => createNewSubexpertise(val, done, index)"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="subdirectory_arrow_right" />
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      Digite para buscar ou criar nova sub-especialização
                    </q-item-section>
                  </q-item>
                </template>
                <template v-slot:append>
                  <q-icon v-if="item.subexpertise?.isNew" name="fiber_new" color="positive">
                    <q-tooltip>Nova sub-especialização</q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>

            <!-- Checkbox e Botão Remover -->
            <div class="col-12 col-md-2 flex row">
              <q-checkbox v-model="item.availableForReferral" label="Indicar" dense />
              <q-btn icon="delete" color="negative" flat size="md" @click="removeExpertise(index)">
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>

      <div class="q-mt-lg flex justify-end">
        <q-btn
          icon="add"
          color="primary"
          label="Adicionar"
          size="md"
          @click="addExpertise"
          unelevated
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { expertiseService } from 'src/services/expertiseService';
import { compareNormalized, includesNormalized } from 'src/utils/stringUtils';
import type { ExpertiseItem, ExpertiseForm } from '../types/formData';
import type { ExpertiseListing } from 'src/types/expertise';

interface Props {
  modelValue: ExpertiseForm[];
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: ExpertiseForm[]];
}>();

const $q = useQuasar();
const fetchedExpertises = ref<ExpertiseItem[]>([]);
const parentFilterInputs = ref<Record<number, string>>({});
const subexpertiseFilters = ref<Record<number, Map<number, ExpertiseItem[]>>>({});
const subexpertiseFilterInputs = ref<Record<number, string>>({});

const expertiseItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const loadSubexpertises = async (parentId: number) => {
  if (subexpertiseFilters.value[parentId]) {
    return;
  }

  try {
    const response = await expertiseService.getChildren(parentId);

    if (response.success) {
      const children = response.data.map(mapApiResponseToForm);
      if (!subexpertiseFilters.value[parentId]) {
        subexpertiseFilters.value[parentId] = new Map();
      }
      subexpertiseFilters.value[parentId].set(parentId, children);
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar sub-especializações',
        caption: response.message || 'Tente novamente',
      });
    }
  } catch (error) {
    console.error('Erro ao carregar sub-especializações:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar sub-especializações',
      caption: 'Erro inesperado',
    });
  }
};

const filteredParentExpertises = computed(() => {
  return (index: number) => {
    const searchText = parentFilterInputs.value[index] || '';
    return searchText
      ? fetchedExpertises.value.filter((e) => includesNormalized(e.name, searchText))
      : fetchedExpertises.value;
  };
});

const getFilteredSubexpertises = (index: number): ExpertiseItem[] => {
  const item = expertiseItems.value[index];
  if (!item?.expertise?.expertiseId) {
    return [];
  }

  const parentId = item.expertise.expertiseId;
  const allSubs = subexpertiseFilters.value[parentId]?.get(parentId) || [];
  const searchText = subexpertiseFilterInputs.value[index] || '';

  return searchText ? allSubs.filter((s) => includesNormalized(s.name, searchText)) : allSubs;
};

const filterParentExpertises = (val: string, update: (fn: () => void) => void, index: number) => {
  update(() => {
    parentFilterInputs.value[index] = val;
  });
};

const onParentInputChange = (val: string, index: number) => {
  const item = expertiseItems.value[index];
  if (!item) {
    return;
  }

  if (val && val !== item.expertise?.name) {
    item.expertise = undefined;
  }
};

const filterSubexpertises = (val: string, update: (fn: () => void) => void, index: number) => {
  update(() => {
    subexpertiseFilterInputs.value[index] = val;
  });
};

const onSubexpertiseInputChange = (val: string, index: number) => {
  const item = expertiseItems.value[index];
  if (!item) {
    return;
  }

  if (val && val !== item.subexpertise?.name) {
    item.subexpertise = undefined;
  }
};

const onExpertiseChange = async (index: number) => {
  const item = expertiseItems.value[index];
  if (!item) return;

  item.subexpertise = undefined;
  subexpertiseFilterInputs.value[index] = '';

  const expertiseId = item.expertise?.expertiseId;
  if (!expertiseId || item.expertise?.isNew) {
    return;
  }

  await loadSubexpertises(expertiseId);
};

const createNewExpertise = (
  val: string,
  done: (item: ExpertiseItem, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
) => {
  const newSpec: ExpertiseItem = {
    name: val,
    isNew: true,
  };
  fetchedExpertises.value.push(newSpec);
  fetchedExpertises.value.sort((a, b) => compareNormalized(a.name, b.name));
  done(newSpec, 'add-unique');
};

const createNewSubexpertise = (
  val: string,
  done: (item: ExpertiseItem, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
  index: number,
) => {
  const parentId = expertiseItems.value[index]?.expertise?.expertiseId;

  const newSubexpertise: ExpertiseItem = {
    name: val,
    parentExpertiseId: parentId,
    isNew: true,
  };
  done(newSubexpertise, 'add-unique');
};

const addExpertise = () => {
  expertiseItems.value.push({
    availableForReferral: false,
  });
};

const removeExpertise = (index: number) => {
  expertiseItems.value = expertiseItems.value.filter((_, i) => i !== index);
};

const mapApiResponseToForm = (apiResponse: ExpertiseListing): ExpertiseItem => {
  return {
    name: apiResponse.name,
    expertiseId: apiResponse.expertiseId,
    parentExpertiseId: apiResponse.parentExpertiseId,
    isNew: false,
  };
};

onMounted(async () => {
  try {
    const response = await expertiseService.getParentExpertises();

    if (response.success) {
      fetchedExpertises.value = response.data.map(mapApiResponseToForm);

      expertiseItems.value.forEach((item) => {
        if (item.expertise?.expertiseId && !subexpertiseFilters.value[item.expertise.expertiseId]) {
          void loadSubexpertises(item.expertise.expertiseId);
        }
      });
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar especializações',
        caption: response.message || 'Tente novamente mais tarde',
      });
    }
  } catch (error) {
    console.error('Erro ao carregar especializações:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados',
      caption: 'Verifique sua conexão e tente novamente',
    });
  }
});
</script>

<style scoped>
.border-negative {
  border: 2px solid var(--q-negative);
}
</style>
