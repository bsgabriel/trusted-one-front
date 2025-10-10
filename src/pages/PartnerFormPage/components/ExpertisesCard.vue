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
                :options="item.expertiseOptions || []"
                option-label="name"
                option-value="expertiseId"
                @filter="(val, update) => filterExpertises(val, update, index)"
                @update:model-value="onExpertiseChange(index)"
                @input-value="(val) => onExpertiseInputChange(val, index)"
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
                :options="item.filteredSubexpertiseOptions"
                option-label="name"
                option-value="subexpertiseId"
                @filter="(val, update) => filterSubexpertises(val, update, index)"
                @input-value="(val) => onSubexpertiseInputChange(val, index)"
                :disable="!item.expertise"
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
import type { ExpertiseListing } from 'src/types/expertise';
import type { ExpertiseForm, ExpertiseItem } from '../types/formData';
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { expertiseService } from 'src/services/expertiseService';
import { includesNormalized } from 'src/utils/stringUtils';

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

const expertiseItems = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const addExpertise = () => {
  expertiseItems.value.push({
    availableForReferral: false,
    expertiseOptions: fetchedExpertises.value,
    filteredSubexpertiseOptions: [],
    subexpertiseOptions: [],
  });
};

const removeExpertise = (index: number) => {
  expertiseItems.value = expertiseItems.value.filter((_, i) => i !== index);
};

const filterExpertises = (val: string, update: (fn: () => void) => void, index: number) => {
  update(() => {
    if (expertiseItems.value[index]) {
      expertiseItems.value[index].expertiseOptions = val
        ? fetchedExpertises.value.filter((s) => includesNormalized(s.name, val))
        : fetchedExpertises.value;
    }
  });
};

const onExpertiseInputChange = (val: string, index: number) => {
  const item = expertiseItems.value[index];
  if (!item) {
    return;
  }

  if (val && val !== item.expertise?.name) {
    item.expertise = undefined;
  }
};

const filterSubexpertises = (val: string, update: (fn: () => void) => void, index: number) => {
  const item = expertiseItems.value[index];

  if (!item) {
    return;
  }

  if (!item.expertise?.expertiseId) {
    update(() => {
      item.filteredSubexpertiseOptions = [];
    });
    return;
  }

  update(() => {
    const allSubs = item.subexpertiseOptions || [];

    item.filteredSubexpertiseOptions = val
      ? allSubs.filter((s) => includesNormalized(s.name, val))
      : allSubs;
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

const createNewExpertise = (
  val: string,
  done: (item: ExpertiseItem, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
) => {
  const newSpec: ExpertiseItem = {
    name: val,
    isNew: true,
  };
  fetchedExpertises.value.push(newSpec);
  fetchedExpertises.value.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  done(newSpec, 'add-unique');
};

const createNewSubexpertise = (
  val: string,
  done: (item: ExpertiseItem, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
  index: number,
) => {
  const parentId = expertiseItems.value[index]?.expertise?.expertiseId;

  const newSubspec: ExpertiseItem = {
    parentExpertiseId: parentId,
    name: val,
    isNew: true,
  };
  done(newSubspec, 'add-unique');
};

const onExpertiseChange = async (index: number) => {
  const item = expertiseItems.value[index];
  if (!item) {
    return;
  }

  item.subexpertise = undefined;
  item.filteredSubexpertiseOptions = [];
  const expertiseId = item.expertise?.expertiseId;

  if (!expertiseId) {
    return;
  }

  try {
    const response = await expertiseService.getChildren(expertiseId);

    if (response.success) {
      const arr = response.data.map(mapApiResponseToForm);

      item.filteredSubexpertiseOptions = arr;
      item.subexpertiseOptions = arr;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar sub-especializações',
        caption: response.message || 'Tente novamente',
      });
    }
  } catch (error) {
    console.log(error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar sub-especializações',
      caption: 'Erro inesperado',
    });
  }
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
        item.expertiseOptions = fetchedExpertises.value;
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
