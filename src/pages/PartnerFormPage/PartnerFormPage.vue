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

    <q-form @submit="onSubmit" class="q-gutter-md" greedy>
      <!-- Dados Básicos -->
      <div>
        <q-item class="bg-grey-3 q-mb-md">
          <q-item-section avatar>
            <q-icon name="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Dados Básicos</q-item-label>
            <q-item-label caption>Nome, grupo e empresa</q-item-label>
          </q-item-section>
        </q-item>

        <BasicDataCard v-model="basicData" flat />
      </div>

      <!-- Meios de Contato -->
      <q-expansion-item
        default-opened
        icon="contact_phone"
        label="Meios de Contato"
        :caption="getContactMethodsCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ContactMethodsCard v-model="form.contactMethods" />
      </q-expansion-item>

      <!-- Especializações -->
      <q-expansion-item
        default-opened
        icon="school"
        label="Especializações"
        :caption="getExpertisesCaption()"
        header-class="bg-grey-3 text-h6"
      >
        <ExpertisesCard v-model="form.expertises" />
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
      <div class="row items-center q-mt-lg">
        <q-btn v-if="isEditing" label="Excluir Contato" color="negative" @click="deletePartner" />
        <q-space />
        <div class="row q-gutter-sm">
          <q-btn label="Cancelar" color="grey-7" flat @click="onCancel" :disable="isSubmitting" />
          <q-btn label="Salvar" type="submit" color="primary" :loading="isSubmitting" unelevated />
        </div>
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
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
import type { AssignedExpertise } from 'src/types/expertise';
import { partnerService } from 'src/services/partnerService';
import { useApiError } from 'src/composables/useApiError';
import { useNotification } from 'src/composables/useNotification';
import { useDialog } from 'src/composables/useDialog';

const { notifyError } = useApiError();
const router = useRouter();
const route = useRoute();
const { showSuccess } = useNotification();
const { showConfirm } = useDialog();

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
  return `${count} especializaç${count === 1 ? 'ão' : 'ões'} adicionada${count === 1 ? '' : 's'}`;
};

const formToPartner = (formData: PartnerForm): Partner => {
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

  const mapExpertises = (form: ExpertiseForm): AssignedExpertise | undefined => {
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
    company: formData.basicData.company?.name ? {...formData.basicData.company, partners: []} : undefined,
    group: formData.basicData.group?.name ? {...formData.basicData.group, partners: []} : undefined,
    contactMethods: formData.contactMethods.map(mapContactMethod),
    gainsProfile: formData.gainsProfile.map(mapGainsProfile),
    businessProfile: formData.businessProfile.map(mapBusinessProfile),
    expertises: formData.expertises.map(mapExpertises).filter((expertise) => !!expertise),
  };
};

const createParnter = () => {
  const partner = formToPartner(form.value);
  isSubmitting.value = true;

  partnerService
    .createPartner(partner)
    .then(() => {
      showSuccess('Parceiro criado com sucesso!');
      void router.push('/parceiros');
    })
    .catch(notifyError)
    .finally(() => (isSubmitting.value = false));
};

const updatePartner = () => {
  const partner = formToPartner(form.value);
  isSubmitting.value = true;

  partnerService
    .updatePartner(partner)
    .then(() => {
      showSuccess('Parceiro atualizado com sucesso!');
      void router.push('/parceiros');
    })
    .catch(notifyError)
    .finally(() => (isSubmitting.value = false));
};

const deletePartner = () => {
  if (!form.value.partnerId) {
    return;
  }

  showConfirm('Deseja remover esse contato?', 'Excluir Parceiro').onOk(() => {
    partnerService
      .deletePartner(form.value.partnerId!)
      .then(() => {
        showSuccess('Parceiro excluído com sucesso!');
        void router.push('/parceiros');
      })
      .catch(notifyError);
  });
};

const onSubmit = () => {
  if (isEditing.value) {
    updatePartner();
  } else {
    createParnter();
  }
};

const onCancel = () => {
  router.back();
};

const loadPartnerData = (partnerId: number) => {
  partnerService
    .getPartnerById(partnerId)
    .then(loadFormData)
    .catch((error) => {
      notifyError(error);
      void router.push('/parceiros');
    });
};

const loadFormData = (partner: Partner) => {
  const toFormExpertise = (expertise: AssignedExpertise): ExpertiseForm => {
    return {
      expertise: {
        expertiseId: expertise.parentExpertiseId || expertise.expertiseId,
        name: expertise.parentExpertiseName || expertise.name,
        isNew: false,
      },
      subexpertise: expertise.parentExpertiseId
        ? {
            expertiseId: expertise.expertiseId,
            name: expertise.name,
            isNew: false,
          }
        : undefined,
      availableForReferral: expertise.availableForReferral,
    };
  };

  const mapContactMethod = (contactMethod: ContactMethod): ContactMethodForm => {
    return {
      contactMethodId: contactMethod.contactMethodId,
      type: contactMethod.type,
      info: contactMethod.info,
    };
  };

  const mapGainsPRofile = (profile: GainsProfile): GainsProfileForm => {
    return {
      gainsProfileId: profile.gainsProfileId,
      category: profile.category,
      info: profile.info,
    };
  };

  const mapBusinessProfile = (profile: BusinessProfile): BusinessProfileForm => {
    return {
      businessProfileId: profile.businessProfileId,
      category: profile.category,
      info: profile.info,
    };
  };

  form.value.partnerId = partner.partnerId;
  form.value.basicData.name = partner.name;
  form.value.basicData.company = partner.company;
  form.value.basicData.group = partner.group;
  form.value.contactMethods = partner.contactMethods.map(mapContactMethod);
  form.value.expertises =
    partner.expertises.length > 0
      ? partner.expertises.map(toFormExpertise)
      : [{ availableForReferral: false }];
  form.value.gainsProfile = partner.gainsProfile.map(mapGainsPRofile);
  form.value.businessProfile = partner.businessProfile.map(mapBusinessProfile);
};

onMounted(() => {
  if (isEditing.value) {
    const partnerId = Number(route.params.id);
    loadPartnerData(partnerId);
  }
});
</script>
