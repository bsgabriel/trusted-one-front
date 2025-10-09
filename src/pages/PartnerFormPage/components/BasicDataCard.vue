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
              :options="groupOptions"
              option-label="name"
              option-value="groupId"
              @filter="filterGroups"
              @new-value="createNewGroup"
              new-value-mode="add-unique"
              hint="Digite para buscar ou criar novo"
              clearable
              @input-value="(val) => onGroupInputChange(val)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Digite para buscar ou criar novo grupo
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:append>
                <q-icon v-if="modelValue.group?.isNew" name="fiber_new" color="positive">
                  <q-tooltip>Novo grupo</q-tooltip>
                </q-icon>
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
              :options="companyOptions"
              option-label="name"
              option-value="companyId"
              @filter="filterCompanies"
              @new-value="createNewCompany"
              new-value-mode="add-unique"
              hint="Digite para buscar ou criar novo"
              clearable
              @input-value="(val) => onCompanyInputChange(val)"
            >
              <template v-slot:no-option>
                <q-item>
                  <q-item-section class="text-grey">
                    Digite para buscar ou criar nova empresa
                  </q-item-section>
                </q-item>
              </template>
              <template v-slot:append>
                <q-icon v-if="modelValue.company?.isNew" name="fiber_new" color="positive">
                  <q-tooltip>Nova empresa</q-tooltip>
                </q-icon>
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import type { Group } from 'src/types/group';
import type { Company } from 'src/types/company';
import type { BasicData } from 'src/types/partner';
import { groupService } from 'src/services/groupService';
import { includesNormalized } from 'src/utils/stringUtils';
import { companyService } from 'src/services/companyService';
import { useQuasar } from 'quasar';

interface Props {
  modelValue: BasicData;
}

interface Emits {
  (e: 'update:modelValue', value: BasicData): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const $q = useQuasar();

const fetchedGroups = ref<Group[]>([]);
const groupOptions = ref<Group[]>([]);

const fetchedCompanies = ref<Company[]>([]);
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
  update(() => {
    groupOptions.value = val
      ? fetchedGroups.value.filter((group) => includesNormalized(group.name, val))
      : fetchedGroups.value;
  });
};

const filterCompanies = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    companyOptions.value = val
      ? fetchedCompanies.value.filter((company) => includesNormalized(company.name, val))
      : fetchedCompanies.value;
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

const onGroupInputChange = (val: string) => {
  if (!props.modelValue.group) {
    return;
  }

  if (val && val !== props.modelValue.group.name) {
    updateGroup(undefined);
  }
};

const onCompanyInputChange = (val: string) => {
  if (!props.modelValue.company) {
    return;
  }

  if (val && val !== props.modelValue.company.name) {
    updateCompany(undefined);
  }
};

onMounted(async () => {
  try {
    const [groupData, companyData] = await Promise.all([
      groupService.getGroups(),
      companyService.getCompanies(),
    ]);

    if (groupData.success) {
      fetchedGroups.value = groupData.data;
      groupOptions.value = groupData.data;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar grupos',
        caption: groupData.message || 'Tente novamente mais tarde',
      });
    }

    if (companyData.success) {
      fetchedCompanies.value = companyData.data;
      companyOptions.value = companyData.data;
    } else {
      $q.notify({
        type: 'negative',
        message: 'Erro ao carregar empresas',
        caption: companyData.message || 'Tente novamente mais tarde',
      });
    }
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados',
      caption: 'Verifique sua conexão e tente novamente',
      timeout: 3000,
    });
  }
});
</script>
