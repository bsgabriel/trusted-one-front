<template>
  <q-card>
    <q-card-section>
      <div>
        <!-- Nome -->
        <q-input
          :model-value="modelValue.name"
          @update:model-value="updateName($event as string)"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Nome é obrigatório']"
        />

        <!-- Grupo e Empresa -->
        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-select
              :model-value="modelValue.group"
              @update:model-value="updateGroup"
              label="Grupo"
              outlined
              use-input
              input-debounce="300"
              :options="groupOptions"
              option-label="name"
              option-value="groupId"
              @filter="filterGroups"
              @new-value="createNewGroup"
              new-value-mode="add-unique"
              hint="Digite para buscar ou criar novo"
              clearable
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Digite para buscar ou criar novo grupo
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              :model-value="modelValue.company"
              @update:model-value="updateCompany"
              label="Empresa"
              outlined
              use-input
              input-debounce="300"
              :options="companyOptions"
              option-label="name"
              option-value="companyId"
              @filter="filterCompanies"
              @new-value="createNewCompany"
              new-value-mode="add-unique"
              hint="Digite para buscar ou criar novo"
              clearable
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Digite para buscar ou criar nova empresa
                  </q-item-section>
                </q-item>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Group } from 'src/types/group';
import type { Company } from 'src/types/company';
import type { BasicData } from 'src/types/partner';

interface Props {
  modelValue: BasicData;
}

interface Emits {
  (e: 'update:modelValue', value: BasicData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const groupOptions = ref<Group[]>([]);
const companyOptions = ref<Company[]>([]);

const updateName = (value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: value,
  });
};

const updateGroup = (value: Group | undefined) => {
  emit('update:modelValue', {
    ...props.modelValue,
    group: value,
  });
};

const updateCompany = (value: Company | undefined) => {
  emit('update:modelValue', {
    ...props.modelValue,
    company: value,
  });
};

const filterGroups = (val: string, update: (fn: () => void) => void) => {
  // TODO: Implementar busca na API
  update(() => {
    if (val === '') {
      groupOptions.value = [];
    } else {
      // Simulação - substituir por chamada real à API
      groupOptions.value = [
        { groupId: 1, name: 'Grupo A', isNew: false },
        { groupId: 2, name: 'Grupo B', isNew: false },
      ].filter((g) => g.name.toLowerCase().includes(val.toLowerCase()));
    }
  });
};

const filterCompanies = (val: string, update: (fn: () => void) => void) => {
  // TODO: Implementar busca na API
  update(() => {
    if (val === '') {
      companyOptions.value = [];
    } else {
      // Simulação - substituir por chamada real à API
      companyOptions.value = [
        { companyId: 1, name: 'Empresa A', isNew: false },
        { companyId: 2, name: 'Empresa B', isNew: false },
      ].filter((c) => c.name.toLowerCase().includes(val.toLowerCase()));
    }
  });
};

const createNewGroup = (
  val: string,
  done: (item: Group, mode?: 'add' | 'add-unique' | 'toggle') => void,
) => {
  done({ groupId: null, name: val, isNew: true }, 'add-unique');
};

const createNewCompany = (
  val: string,
  done: (item: Company, mode?: 'add' | 'add-unique' | 'toggle') => void,
) => {
  done({ companyId: null, name: val, isNew: true }, 'add-unique');
};
</script>
