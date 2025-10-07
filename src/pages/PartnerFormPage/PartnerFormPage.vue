<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="person_add" class="q-mr-sm gt-xs" />
          {{ isEditing ? 'Editar Parceiro' : 'Novo Parceiro' }}
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          {{
            isEditing
              ? 'Atualize as informações do parceiro'
              : 'Cadastre um novo parceiro profissional'
          }}
        </p>
      </div>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md">
      <!-- Dados Básicos -->
      <q-expansion-item
        default-opened
        icon="badge"
        label="Dados Básicos"
        caption="Nome, grupo e empresa"
        header-class="bg-grey-3 text-h6"
      >
        <BasicDataCard v-model="basicData" />
      </q-expansion-item>

      <!-- Meios de Contato -->
      <q-expansion-item
        icon="contact_page"
        label="Meios de Contato"
        :caption="getContactMethodsCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ContactMethodsCard v-model="form.contactMethods" :has-error="contactMethodsError" />
      </q-expansion-item>

      <!-- Especializações -->
      <q-expansion-item
        icon="school"
        label="Especializações"
        :caption="getSpecializationsCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ExpertisesCard v-model="form.specializations" :has-error="specializationsError" />
      </q-expansion-item>

      <!-- Botões de Ação -->
      <div class="row q-gutter-sm justify-end q-mt-lg">
        <q-btn label="Cancelar" color="grey-7" flat @click="onCancel" :disable="isSubmitting" />
        <q-btn label="Salvar" type="submit" color="primary" :loading="isSubmitting" unelevated />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import BasicDataCard from './components/BasicDataCard.vue';
import ContactMethodsCard from './components/ContactMethodsCard.vue';
import ExpertisesCard from './components/ExpertisesCard.vue';
import type { Group } from 'src/types/group';
import type { Company } from 'src/types/company';
import type { ContactMethod } from 'src/types/contactMethod';
import type { ExpertiseItem } from 'src/types/expertise';
import type { AdditionalInfo, BasicData, GainsProfile } from 'src/types/partner';

interface PartnerForm {
  name: string;
  group: Group | undefined;
  company: Company | undefined;
  contactMethods: ContactMethod[];
  specializations: ExpertiseItem[];
  gainsProfile: GainsProfile;
  additionalInfo: AdditionalInfo;
}

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const isEditing = computed(() => !!route.params.id);
const isSubmitting = ref(false);

const form = ref<PartnerForm>({
  name: '',
  group: undefined,
  company: undefined,
  contactMethods: [],
  specializations: [],
  gainsProfile: {
    goals: '',
    accomplishments: '',
    interests: '',
    networks: '',
    skills: '',
  },
  additionalInfo: {
    mainProducts: '',
    uniqueProduct: '',
    idealClient: '',
    conversationStarter: '',
  },
});

const contactMethodsError = ref(false);
const specializationsError = ref(false);

const basicData = computed<BasicData>({
  get: () => ({
    name: form.value.name,
    group: form.value.group,
    company: form.value.company,
  }),
  set: (value: BasicData) => {
    form.value.name = value.name;
    form.value.group = value.group;
    form.value.company = value.company;
  },
});

const getContactMethodsCaption = () => {
  const count = form.value.contactMethods.length;
  if (count === 0) return 'Nenhum meio de contato adicionado';
  return `${count} ${count === 1 ? 'meio' : 'meios'} de contato adicionado${count === 1 ? '' : 's'}`;
};

const getSpecializationsCaption = () => {
  const count = form.value.specializations.length;
  if (count === 0) return 'Nenhuma especialização adicionada';
  return `${count} especialização${count === 1 ? '' : 'ões'} adicionada${count === 1 ? '' : 's'}`;
};

const validateForm = (): boolean => {
  contactMethodsError.value = form.value.contactMethods.length === 0;
  specializationsError.value = form.value.specializations.length === 0;

  if (contactMethodsError.value) {
    $q.notify({
      message: 'Adicione pelo menos um meio de contato',
      color: 'negative',
      icon: 'warning',
    });
    return false;
  }

  if (specializationsError.value) {
    $q.notify({
      message: 'Adicione pelo menos uma especialização',
      color: 'negative',
      icon: 'warning',
    });
    return false;
  }

  return true;
};

const onSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  isSubmitting.value = true;

  try {
    // TODO: Implementar chamada à API
    await new Promise((resolve) => setTimeout(resolve, 1500));

    $q.notify({
      message: isEditing.value
        ? 'Parceiro atualizado com sucesso!'
        : 'Parceiro cadastrado com sucesso!',
      color: 'positive',
      icon: 'check',
    });

    void router.push('/partners');
  } catch (error) {
    console.log(error);
    $q.notify({
      message: 'Erro ao salvar parceiro',
      color: 'negative',
      icon: 'error',
    });
  } finally {
    isSubmitting.value = false;
  }
};

const onCancel = () => {
  router.back();
};
</script>
