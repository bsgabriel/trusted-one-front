<template>
  <q-card :class="{ 'border-negative': hasError }">
    <q-card-section>
      <div v-if="specializations.length === 0" class="text-center q-py-md text-grey-6">
        <q-icon name="school" size="3rem" color="grey-4" />
        <div class="q-mt-sm">Nenhuma especialização adicionada</div>
        <div class="text-caption">Adicione pelo menos uma especialização</div>
      </div>

      <div v-else class="q-gutter-md">
        <q-card v-for="(spec, index) in specializations" :key="index" flat bordered class="q-pa-md">
          <div class="row q-col-gutter-md items-start">
            <!-- Especialização Principal -->
            <div class="col-12 col-md-5">
              <q-select
                v-model="spec.specialization"
                label="Especialização *"
                outlined
                dense
                use-input
                input-debounce="300"
                :options="spec.specializationOptions || []"
                option-label="name"
                option-value="specializationId"
                @filter="(val, update) => filterSpecializations(val, update, index)"
                @update:model-value="onSpecializationChange(index)"
                new-value-mode="add-unique"
                @new-value="(val, done) => createNewSpecialization(val, done)"
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
                  <q-icon v-if="spec.specialization?.isNew" name="fiber_new" color="positive">
                    <q-tooltip>Nova especialização</q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>

            <!-- Sub-especialização (opcional) -->
            <div class="col-12 col-md-5">
              <q-select
                v-model="spec.subspecialization"
                label="Sub-especialização (opcional)"
                outlined
                dense
                use-input
                input-debounce="300"
                :options="spec.filteredSubspecializationOptions"
                option-label="name"
                option-value="subspecializationId"
                @filter="(val, update) => filterSubspecializations(val, update, index)"
                :disable="!spec.specialization"
                new-value-mode="add-unique"
                @new-value="(val, done) => createNewSubspecialization(val, done, index)"
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
                  <q-icon v-if="spec.subspecialization?.isNew" name="fiber_new" color="positive">
                    <q-tooltip>Nova sub-especialização</q-tooltip>
                  </q-icon>
                </template>
              </q-select>
            </div>

            <!-- Checkbox e Botão Remover -->
            <div class="col-12 col-md-2 flex row">
              <q-checkbox v-model="spec.availableForReferral" label="Indicar" dense />
              <q-btn
                icon="delete"
                color="negative"
                flat
                size="md"
                @click="removeSpecialization(index)"
              >
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
          @click="addSpecialization"
          unelevated
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ExpertiseListing, ExpertiseItem } from 'src/types/expertise';
import { computed, onMounted, ref } from 'vue';
import { useQuasar } from 'quasar';
import { expertiseService } from 'src/services/expertiseService';
import { includesNormalized } from 'src/utils/stringUtils';

interface Props {
  modelValue: ExpertiseItem[];
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: ExpertiseItem[]];
}>();

const $q = useQuasar();
const fetchedSpecializations = ref<ExpertiseListing[]>([]);

const specializations = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const addSpecialization = () => {
  specializations.value = [
    ...specializations.value,
    {
      specialization: null,
      subspecialization: null,
      availableForReferral: false,
      specializationOptions: fetchedSpecializations.value,
      filteredSubspecializationOptions: [],
      subspecializationOptions: [],
    },
  ];
};

const removeSpecialization = (index: number) => {
  specializations.value = specializations.value.filter((_, i) => i !== index);
};

const filterSpecializations = (val: string, update: (fn: () => void) => void, index: number) => {
  update(() => {
    if (specializations.value[index]) {
      specializations.value[index].specializationOptions = val
        ? fetchedSpecializations.value.filter((s) => includesNormalized(s.name, val))
        : fetchedSpecializations.value;
    }
  });
};

const filterSubspecializations = (val: string, update: (fn: () => void) => void, index: number) => {
  const item = specializations.value[index];

  if (!item) {
    return;
  }

  if (!item.specialization?.expertiseId) {
    update(() => {
      item.filteredSubspecializationOptions = [];
    });
    return;
  }

  update(() => {
    const allSubs = item.subspecializationOptions || item.filteredSubspecializationOptions;

    item.filteredSubspecializationOptions = val
      ? allSubs.filter((s) => includesNormalized(s.name, val))
      : allSubs;
  });
};

const createNewSpecialization = (
  val: string,
  done: (item: ExpertiseListing, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
) => {
  const newSpec: ExpertiseListing = {
    name: val,
    isNew: true,
  };
  done(newSpec, 'add-unique');
};

const createNewSubspecialization = (
  val: string,
  done: (item: ExpertiseListing, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
  index: number,
) => {
  const parentId = specializations.value[index]?.specialization?.expertiseId;

  const newSubspec: ExpertiseListing = {
    parentExpertiseId: parentId,
    name: val,
    isNew: true,
  };
  done(newSubspec, 'add-unique');
};

const onSpecializationChange = async (index: number) => {
  const item = specializations.value[index];
  if (!item) return;

  item.subspecialization = null;
  item.filteredSubspecializationOptions = [];
  const specializationId = item.specialization?.expertiseId;

  if (!specializationId) return;

  try {
    const response = await expertiseService.getSubExpertises(specializationId);

    if (response.success) {
      item.filteredSubspecializationOptions = response.data;
      item.subspecializationOptions = response.data;
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

onMounted(async () => {
  try {
    const response = await expertiseService.getParentExpertises();

    if (response.success) {
      fetchedSpecializations.value = response.data;

      specializations.value.forEach((item) => {
        item.specializationOptions = fetchedSpecializations.value;
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
