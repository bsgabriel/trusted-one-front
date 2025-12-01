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
import type { GroupForm } from '../types/formData';
import type { CompanyForm } from '../types/formData';
import type { BasicDataForm } from '../types/formData';
import { groupService } from 'src/services/groupService';
import { includesNormalized } from 'src/utils/stringUtils';
import { companyService } from 'src/services/companyService';
import { useApiError } from 'src/composables/useApiError';

interface Props {
  modelValue: BasicDataForm;
}

interface Emits {
  (e: 'update:modelValue', value: BasicDataForm): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const { notifyError } = useApiError();

const fetchedGroups = ref<GroupForm[]>([]);
const groupOptions = ref<GroupForm[]>([]);

const fetchedCompanies = ref<CompanyForm[]>([]);
const companyOptions = ref<CompanyForm[]>([]);

const updateName = (value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    name: value,
  });
};

const updateGroup = (value?: GroupForm) => {
  emit('update:modelValue', {
    ...props.modelValue,
    group: value,
  });
};

const updateCompany = (value?: CompanyForm) => {
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
  done: (item: GroupForm, mode?: 'add' | 'add-unique' | 'toggle') => void,
) => {
  done({ groupId: null, name: val, isNew: true }, 'add-unique');
};

const createNewCompany = (
  val: string,
  done: (item: CompanyForm, mode?: 'add' | 'add-unique' | 'toggle') => void,
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

const loadInitialData = () => {
  Promise.all([groupService.getGroups(), companyService.getCompanies()])
    .then(([groupData, companyData]) => {
      fetchedGroups.value = groupData;
      groupOptions.value = groupData;

      fetchedCompanies.value = companyData;
      companyOptions.value = companyData;
    })
    .catch(notifyError);
};

onMounted(() => {
  loadInitialData();
});
</script>
