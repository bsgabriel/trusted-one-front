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
                :options="spec.subspecializationOptions || []"
                option-label="name"
                option-value="subspecializationId"
                @filter="(val, update) => filterSubspecializations(val, update, index)"
                :disable="!spec.specialization"
                new-value-mode="add-unique"
                @new-value="(val, done) => createNewSubspecialization(val, done)"
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
import type { Specialization, Subspecialization, ExpertiseItem } from 'src/types/expertise';
import { computed } from 'vue';

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
      specializationOptions: [],
      subspecializationOptions: [],
    },
  ];
};

const removeSpecialization = (index: number) => {
  specializations.value = specializations.value.filter((_, i) => i !== index);
};

const filterSpecializations = (val: string, update: (fn: () => void) => void, index: number) => {
  update(() => {
    void (async () => {
      try {
        const results = await fetchSpecializations(val);

        if (specializations.value[index]) {
          specializations.value[index].specializationOptions = results;
        }
      } catch (error) {
        console.error('Erro ao buscar especializações:', error);
      }
    })();
  });
};

const filterSubspecializations = (val: string, update: (fn: () => void) => void, index: number) => {
  const specializationId = specializations.value[index]?.specialization?.specializationId;

  if (!specializationId) {
    if (specializations.value[index]) {
      specializations.value[index].subspecializationOptions = [];
    }
    update(() => {});
    return;
  }

  update(() => {
    void (async () => {
      try {
        const results = await fetchSubspecializations(specializationId, val);

        if (specializations.value[index]) {
          specializations.value[index].subspecializationOptions = results;
        }
      } catch (error) {
        console.error('Erro ao buscar sub-especializações:', error);
      }
    })();
  });
};

const createNewSpecialization = (
  val: string,
  done: (item: Specialization, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
) => {
  const newSpec: Specialization = {
    specializationId: null,
    name: val,
    isNew: true,
  };
  done(newSpec, 'add-unique');
};

const createNewSubspecialization = (
  val: string,
  done: (item: Subspecialization, mode: 'add' | 'add-unique' | 'toggle' | undefined) => void,
) => {
  const newSubspec: Subspecialization = {
    subspecializationId: null,
    name: val,
    isNew: true,
  };
  done(newSubspec, 'add-unique');
};

const onSpecializationChange = async (index: number) => {
  if (specializations.value[index]) {
    // 1. Limpa a sub-especialização atual
    specializations.value[index].subspecialization = null;

    const specializationId = specializations.value[index]?.specialization?.specializationId;

    if (specializationId) {
      try {
        // 2. Chama a busca para pré-carregar as opções (termo vazio)
        const results = await fetchSubspecializations(specializationId, '');

        // 3. Atualiza as opções, que estarão prontas ao focar no campo
        specializations.value[index].subspecializationOptions = results;
      } catch (error) {
        console.error('Erro ao carregar opções iniciais de sub-especialização:', error);
        specializations.value[index].subspecializationOptions = [];
      }
    } else {
      // Limpa as opções se a especialização principal for desmarcada
      specializations.value[index].subspecializationOptions = [];
    }
  }
};

const fetchSpecializations = (searchTerm: string): Promise<Specialization[]> => {
  // TODO: criar service para chamar API (vai receber o termo e trazer filtrado do back)
  return new Promise((resolve) => {
    const mockData: Specialization[] = [
      { specializationId: '1', name: 'Tecnologia da Informação' },
      { specializationId: '2', name: 'Recursos Humanos' },
      { specializationId: '3', name: 'Marketing Digital' },
      { specializationId: '4', name: 'Contabilidade' },
      { specializationId: '5', name: 'Advocacia' },
    ];

    const results = mockData.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Simula o tempo de resposta da API
    setTimeout(() => resolve(results), 300);
  });
};

const fetchSubspecializations = (
  specializationId: string,
  searchTerm: string,
): Promise<Subspecialization[]> => {
  return new Promise((resolve) => {
    let mockData: Subspecialization[] = [];

    // TODO: criar service para chamar API (recebe )
    if (specializationId === '1') {
      mockData = [
        { subspecializationId: '101', name: 'Desenvolvimento Web' },
        { subspecializationId: '102', name: 'Análise de Dados' },
        { subspecializationId: '103', name: 'Segurança da Informação' },
      ];
    } else if (specializationId === '3') {
      mockData = [
        { subspecializationId: '201', name: 'SEO e SEM' },
        { subspecializationId: '202', name: 'Mídias Sociais' },
        { subspecializationId: '203', name: 'E-mail Marketing' },
      ];
    }

    const results = mockData.filter((s) => s.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // Simula o tempo de resposta da API
    setTimeout(() => resolve(results), 300);
  });
};
</script>

<style scoped>
.border-negative {
  border: 2px solid var(--q-negative);
}
</style>
