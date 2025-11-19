<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="handshake" class="q-mr-sm gt-xs" />
          Indicar Parceiro
        </h4>
      </div>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md" greedy>
      <!-- Dados de quem receberá indicação -->
      <div>
        <q-item class="bg-grey-3 q-mb-md">
          <q-item-section>
            <q-item-label class="text-h6">Para quem será feita a indicação?</q-item-label>
          </q-item-section>
        </q-item>

        <q-input
          v-model="form.name"
          label="Nome Completo"
          :rules="[(val) => !!val || 'O nome é obrigatório']"
          outlined
          clearable
        />
      </div>

      <!-- Dados de quem será indicado -->
      <div>
        <q-item class="bg-grey-3 q-mb-md">
          <q-item-section>
            <q-item-label class="text-h6">Quem será indicado?</q-item-label>
          </q-item-section>
        </q-item>

        <q-select
          :model-value="form.partner"
          @update:model-value="updatePartner"
          label="Parceiro"
          outlined
          use-input
          :options="partnerOptions"
          option-label="name"
          option-value="partnerId"
          @filter="filterPartners"
          hint="Digite para buscar"
          clearable
          @input-value="(val) => onPartnerInputChange(val)"
          :loading="isLoading"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Digite para buscar</q-item-section>
            </q-item>
          </template>
        </q-select>
      </div>

      <!-- Tipo de indicação -->
      <q-slide-transition>
        <div v-if="expertises.length > 0">
          <q-item class="bg-grey-3 q-mb-md">
            <q-item-section>
              <q-item-label class="text-h6">Qual será a área de indicação?</q-item-label>
            </q-item-section>
          </q-item>

          <div class="q-pl-md">
            <q-option-group
              v-model="form.expertise"
              :options="expertiseOptions"
              type="radio"
              color="primary"
              :rules="[(val: Expertise | undefined) => !!val || 'Selecione uma especialização']"
            />
          </div>
        </div>
      </q-slide-transition>

      <!-- Botões de ação -->
      <div class="row justify-end q-gutter-sm q-mt-md">
        <q-btn label="Cancelar" color="grey" flat />
        <q-btn label="Indicar" type="submit" color="primary" />
      </div>
    </q-form>
  </q-page>
</template>

<script setup lang="ts">
import type { PartnerListing } from 'src/types/partner';
import type { FormData } from './types/formData';
import type { Expertise } from 'src/types/expertise';
import type { ReferralCreateParams } from 'src/types/referral';
import { computed, ref } from 'vue';
import { partnerService } from 'src/services/partnerService';
import { referralService } from 'src/services/referralService';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { useApiError } from 'src/composables/useApiError';

const form = ref<FormData>({});
const partnerOptions = ref<PartnerListing[]>([]);
const isLoading = ref<boolean>(false);
const expertises = ref<Expertise[]>([]);
const $q = useQuasar();
const router = useRouter();
const { notifyError } = useApiError();

const expertiseOptions = computed(() => {
  return expertises.value.map((expertise) => ({
    label: expertise.parentExpertiseName
      ? `${expertise.name} (${expertise.parentExpertiseName})`
      : expertise.name,
    value: expertise,
  }));
});

const updatePartner = (value?: PartnerListing) => {
  form.value.partner = value;
  if (!value) {
    expertises.value = [];
    return;
  }

  partnerService
    .findfindRecommendableExpertises(value.partnerId)
    .then((result) => (expertises.value = result))
    .catch(notifyError);
};

const filterPartners = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    isLoading.value = true;
    partnerService
      .listPartners({
        page: 0,
        size: 30,
        search: val,
        fullSearch: false,
      })
      .then((result) => (partnerOptions.value = result.content))
      .catch(notifyError)
      .finally(() => (isLoading.value = false));
  });
};

const onPartnerInputChange = (val: string) => {
  if (!form.value.partner) {
    return;
  }

  if (val && val !== form.value.partner.name) {
    updatePartner(undefined);
  }
};

const onSubmit = () => {
  const createReferralParams = (form: FormData): ReferralCreateParams => {
    return {
      partnerId: form.partner!.partnerId,
      expertiseId: form.expertise!.expertiseId!,
      referredTo: form.name!,
    };
  };

  const params = createReferralParams(form.value);
  referralService
    .createReferral(params)
    .then(() => {
      $q.notify({
        message: 'Indicação realizada com sucesso!',
        color: 'positive',
        icon: 'check',
      });

      void router.push('/historico');
    })
    .catch(notifyError);
};
</script>
