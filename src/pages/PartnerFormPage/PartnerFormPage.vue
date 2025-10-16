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
        icon="account_box"
        label="Dados Básicos"
        caption="Nome, grupo e empresa"
        header-class="bg-grey-3 text-h6"
      >
        <BasicDataCard v-model="basicData" />
      </q-expansion-item>

      <!-- Meios de Contato -->
      <q-expansion-item
        default-opened
        icon="contact_phone"
        label="Meios de Contato"
        :caption="getContactMethodsCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ContactMethodsCard v-model="form.contactMethods" :has-error="contactMethodsError" />
      </q-expansion-item>

      <!-- Especializações -->
      <q-expansion-item
        default-opened
        icon="school"
        label="Especializações"
        :caption="getExpertisesCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ExpertisesCard v-model="form.expertises" :has-error="specializationsError" />
      </q-expansion-item>

      <!-- Perfil GAINS -->
      <q-expansion-item
        icon="psychology"
        label="Perfil GAINS"
        caption="Goals, Accomplishments, Interests, Networks, Skills"
        header-class="bg-grey-3 text-h6"
      >
        <GainsProfileCard v-model="form.gainsProfile" />
      </q-expansion-item>

      <!-- Perfil Profissional -->
      <q-expansion-item
        icon="badge"
        label="Perfil Profissional"
        caption="Produtos, cliente ideal e como iniciar conversa"
        header-class="bg-grey-3 text-h6"
      >
        <BusinessProfileCard v-model="form.businessProfile" />
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
import GainsProfileCard from './components/GainsProfileCard.vue';
import BusinessProfileCard from './components/BusinessProfileCard.vue';
import type {
  BasicDataForm,
  BusinessProfileForm,
  ContactMethodForm,
  ExpertiseForm,
  GainsProfileForm,
  PartnerForm,
} from './types/formData';
import type { BusinessProfile, GainsProfile, Partner } from 'src/types/partner';
import type { ContactMethod } from 'src/types/contactMethod';
import type { Expertise } from 'src/types/expertise';
import { partnerService } from 'src/services/partnerService';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();

const isEditing = computed(() => !!route.params.id);
const isSubmitting = ref(false);

const form = ref<PartnerForm>({
  basicData: {
    name: '',
  },
  contactMethods: [{ type: '', info: '' }],
  expertises: [{ availableForReferral: false }],
  gainsProfile: [],
  businessProfile: [],
});

const contactMethodsError = ref(false);
const specializationsError = ref(false);

const basicData = computed<BasicDataForm>({
  get: () => ({
    name: form.value.basicData.name,
    group: form.value.basicData.group,
    company: form.value.basicData.company,
  }),
  set: (value: BasicDataForm) => {
    form.value.basicData.name = value.name;
    form.value.basicData.group = value.group;
    form.value.basicData.company = value.company;
  },
});

const getContactMethodsCaption = () => {
  const count = form.value.contactMethods.length;
  if (count === 0) return 'Nenhum meio de contato adicionado';
  return `${count} ${count === 1 ? 'meio' : 'meios'} de contato adicionado${count === 1 ? '' : 's'}`;
};

const getExpertisesCaption = () => {
  const count = form.value.expertises.length;
  if (count === 0) return 'Nenhuma especialização adicionada';
  return `${count} especialização${count === 1 ? '' : 'ões'} adicionada${count === 1 ? '' : 's'}`;
};

const validateForm = (): boolean => {
  contactMethodsError.value = form.value.contactMethods.length === 0;
  specializationsError.value = form.value.expertises.length === 0;

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

const createPartner = (formData: PartnerForm): Partner => {
  const mapContactMethod = (form: ContactMethodForm): ContactMethod => {
    return {
      contactMethodId: form.contactMethodId,
      type: form.type,
      info: form.info,
    };
  };

  const mapGainsProfile = (form: GainsProfileForm): GainsProfile => {
    return {
      gainsProfileId: form.gainsProfileId,
      category: form.category,
      info: form.info,
    };
  };

  const mapBusinessProfile = (form: BusinessProfileForm): BusinessProfile => {
    return {
      businessProfileId: form.businessProfileId,
      category: form.category,
      info: form.info,
    };
  };

  const mapExpertises = (form: ExpertiseForm): Expertise | undefined => {
    if (!form.expertise) {
      return undefined;
    }

    if (form.subexpertise) {
      return {
        expertiseId: form.subexpertise.expertiseId,
        parentExpertiseId: form.expertise.expertiseId,
        parentExpertiseName: form.expertise.name,
        name: form.subexpertise.name,
        availableForReferral: form.availableForReferral,
      };
    }

    return {
      expertiseId: form.expertise.expertiseId,
      name: form.expertise.name,
      availableForReferral: form.availableForReferral,
    };
  };

  return {
    partnerId: formData.partnerId,
    name: formData.basicData.name,
    company: formData.basicData.company?.name ? formData.basicData.company : undefined,
    group: formData.basicData.group?.name ? formData.basicData.group : undefined,
    contactMethods: formData.contactMethods.map(mapContactMethod),
    gainsProfile: formData.gainsProfile.map(mapGainsProfile),
    businessProfile: formData.businessProfile.map(mapBusinessProfile),
    expertises: formData.expertises.map(mapExpertises).filter((expertise) => !!expertise),
  };
};

const onSubmit = async () => {
  if (!validateForm()) {
    return;
  }

  console.log('formData', form.value);
  const partner = createPartner(form.value);
  console.log('partner', partner);
  isSubmitting.value = true;

  try {
    await partnerService.createPartner(partner).then((result) => {
      if (result.success) {
        console.log('parceiro criado', result.data);
      } else {
        console.log('erro', result);
      }
    });

    $q.notify({
      message: isEditing.value
        ? 'Parceiro atualizado com sucesso!'
        : 'Parceiro cadastrado com sucesso!',
      color: 'positive',
      icon: 'check',
    });

    void router.push('/parceiros');
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
