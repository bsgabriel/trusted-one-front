<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="category" class="q-mr-sm gt-xs" />
          {{ isEditing ? 'Editar Especialização' : 'Nova Especialização' }}
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          {{
            isEditing
              ? 'Atualize as informações da especialização'
              : 'Cadastre uma nova especialização'
          }}
        </p>
      </div>
    </div>

    <q-form @submit="onSubmit" class="q-gutter-md" greedy>
      <div>
        <q-item class="bg-grey-3 q-mb-md">
          <q-item-section avatar>
            <q-icon name="account_box" />
          </q-item-section>
          <q-item-section>
            <q-item-label class="text-h6">Dados da Especialização</q-item-label>
            <q-item-label caption>Nome e área de atuação</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Expertise Pai (readonly) -->
        <q-input
          v-if="isEditing"
          :model-value="form.parentExpertiseName"
          label="Área de Atuação"
          outlined
          readonly
          class="q-mb-md"
        >
          <template v-slot:prepend>
            <q-icon name="school" />
          </template>
        </q-input>

        <!-- Nome -->
        <q-input
          v-model="form.name"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Nome é obrigatório']"
        />

        <!-- Lista de Parceiros -->
        <q-expansion-item
          default-opened
          icon="people"
          label="Parceiros"
          :caption="getPartnerListCaption()"
          header-class="bg-grey-3 text-h6 q-mt-md"
        >
          <!-- Botões no Topo -->
          <div class="q-pa-md bg-grey-2">
            <div v-if="selectedPartners.length === 0" class="q-gutter-sm">
              <q-btn
                label="Associar Parceiro"
                icon="person_add"
                color="primary"
                unelevated
                @click="showPartnerDialog = true"
              />
              <q-btn
                v-if="form.partners.length"
                label="Remover Parceiros"
                icon="person_remove"
                color="negative"
                outline
                @click="removePartners"
              />
            </div>
            <div v-else class="q-gutter-sm">
              <q-btn
                label="Remover Selecionados"
                icon="person_remove"
                color="negative"
                outline
                @click="removePartners"
              />
              <q-btn
                label="Limpar Seleção"
                icon="close"
                color="black"
                outline
                @click="clearSelection"
              />
            </div>
          </div>

          <!-- Lista -->
          <q-list separator>
            <q-item
              v-for="partner in form.partners"
              :key="partner.partnerId"
              clickable
              v-ripple
              @click="goToPartnerDetails(partner.partnerId)"
              class="q-py-md"
            >
              <q-item-section side>
                <q-checkbox
                  :model-value="selectedPartners.includes(partner.partnerId)"
                  @update:model-value="togglePartnerSelection(partner.partnerId)"
                  @click.stop
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium text-body1">
                  {{ partner.name }}
                </q-item-label>
                <q-item-label caption>
                  {{
                    partner.availableForReferral ? 'Disponível para indicação' : 'Não disponível'
                  }}
                </q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-toggle
                  :model-value="partner.availableForReferral"
                  @update:model-value="toggleAvailableForReferral(partner.partnerId)"
                  @click.stop
                  color="primary"
                  label="Indicação"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Botões de Ação -->
        <div class="row items-center q-mt-lg">
          <q-btn
            v-if="isEditing"
            label="Excluir Especialização"
            color="negative"
            @click="deleteSpecialization"
            :disable="isLoading"
          />
          <q-space />
          <div class="row q-gutter-sm">
            <q-btn
              label="Cancelar"
              color="grey-7"
              flat
              @click="router.back()"
              :disable="isLoading"
            />
            <q-btn label="Salvar" type="submit" color="primary" :loading="isLoading" unelevated />
          </div>
        </div>
      </div>
    </q-form>

    <PartnerSelectionDialog
      v-model="showPartnerDialog"
      :exclude-partner-ids="form.partners.map((p) => p.partnerId)"
      @confirm="onDialogPartnersSelected"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { SpecializationFormRequest, PartnerExpertise } from 'src/types/expertise';
import type { SpecializationForm, SpecializationPartnerForm } from './types/formData';
import type { PartnerListing } from 'src/types/partner';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { expertiseService } from 'src/services/expertiseService';
import { useApiError } from 'src/composables/useApiError';
import { useDialog } from 'src/composables/useDialog';
import { useNotification } from 'src/composables/useNotification';
import PartnerSelectionDialog from './components/PartnerSelectionDialog.vue';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const isEditing = computed(() => !!route.params.specializationId);
const isLoading = ref(false);
const selectedPartners = ref<number[]>([]);
const showPartnerDialog = ref(false);
const { notifyError } = useApiError();
const { showConfirm } = useDialog();
const { showSuccess } = useNotification();

const form = ref<SpecializationForm>({
  name: '',
  parentExpertiseId: Number(route.params.expertiseId),
  partners: [],
});

const getPartnerListCaption = () => {
  const count = form.value.partners?.length || 0;
  if (count === 0) {
    return 'Nenhum parceiro foi adicionado à esta especialização';
  }
  return `${count} parceiro${count === 1 ? '' : 's'} adicionado${count === 1 ? '' : 's'}`;
};

const loadSpecializationData = (expertiseId: number, specializationId: number) => {
  console.log('expertiseId', expertiseId);
  const mapPartner = (partner: PartnerExpertise): SpecializationPartnerForm => ({
    partnerId: partner.partnerId,
    name: partner.partnerName,
    availableForReferral: partner.availableForReferral,
  });

  isLoading.value = true;
  expertiseService
    .fetchSpecialization(specializationId)
    .then((result) => {
      form.value.expertiseId = specializationId;
      form.value.name = result.name;
      form.value.parentExpertiseId = result.parentExpertiseId;
      form.value.parentExpertiseName = result.parentExpertiseName;
      form.value.partners = result.partners.map(mapPartner);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const togglePartnerSelection = (partnerId: number) => {
  const index = selectedPartners.value.indexOf(partnerId);
  if (index > -1) {
    selectedPartners.value.splice(index, 1);
  } else {
    selectedPartners.value.push(partnerId);
  }
};

const toggleAvailableForReferral = (partnerId: number) => {
  const partner = form.value.partners.find((p) => p.partnerId === partnerId);
  if (partner) {
    partner.availableForReferral = !partner.availableForReferral;
  }
};

const clearSelection = () => {
  selectedPartners.value = [];
};

const removePartners = () => {
  const count = selectedPartners.value.length;
  const isRemovingAll = count === form.value.partners.length || count === 0;

  const message = isRemovingAll
    ? 'Deseja remover TODOS os parceiros desta especialização?'
    : `Deseja remover ${count} parceiro${count === 1 ? '' : 's'} desta especialização?`;

  showConfirm(message, 'Remover Parceiros').onOk(() => {
    if (isRemovingAll) {
      form.value.partners = [];
    } else {
      form.value.partners = form.value.partners.filter(
        (partner: SpecializationPartnerForm) => !selectedPartners.value.includes(partner.partnerId),
      );
      clearSelection();
    }
  });
};

const goToPartnerDetails = (partnerId: number) => {
  void router.push(`/parceiros/${partnerId}`);
};

const onDialogPartnersSelected = (partners: PartnerListing[]) => {
  const newPartners = partners.map((partner) => ({
    partnerId: partner.partnerId,
    name: partner.name,
    availableForReferral: false,
  }));

  form.value.partners.push(...newPartners);
  form.value.partners.sort((a, b) => a.name.localeCompare(b.name));
};

const createSpecializationFormRequest = (form: SpecializationForm): SpecializationFormRequest => {
  return {
    name: form.name,
    parentExpertiseId: form.parentExpertiseId,
    partners: form.partners.map((p: SpecializationPartnerForm) => ({
      partnerId: p.partnerId,
      name: p.name,
      availableForReferral: p.availableForReferral,
    })),
  };
};

const onSubmit = () => {
  if (isEditing.value) {
    updateSpecialization();
  } else {
    createSpecialization();
  }
};

const updateSpecialization = () => {
  isLoading.value = true;
  expertiseService
    .updateSpecialization(form.value.expertiseId!, createSpecializationFormRequest(form.value))
    .then(() => {
      showSuccess('Especialização atualizada com sucesso');
      void router.push(`/expertise/${form.value.parentExpertiseId}`);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const createSpecialization = () => {
  isLoading.value = true;
  expertiseService
    .createSpecialization(createSpecializationFormRequest(form.value))
    .then(() => {
      showSuccess('Especialização criada com sucesso');
      void router.push(`/expertise/${form.value.parentExpertiseId}`);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const deleteSpecialization = () => {
  const partnerCount = form.value.partners.length;
  const message =
    partnerCount > 0
      ? `Os ${partnerCount} parceiro${partnerCount === 1 ? '' : 's'} ficarão sem esta especialização vinculada.`
      : undefined;

  showConfirm(
    'Deseja realmente excluir esta especialização?',
    'Excluir Especialização',
    message,
  ).onOk(() => {
    expertiseService
      .deleteSpecialization(form.value.expertiseId!)
      .then(() => {
        showSuccess('Especialização excluída com sucesso');
        void router.push(`/expertise/${form.value.parentExpertiseId}`);
      })
      .catch((err) => {
        notifyError(err);
      });
  });
};

onMounted(() => {
  if (isEditing.value) {
    const expertiseId = Number(route.params.expertiseId);
    const specializationId = Number(route.params.specializationId);
    loadSpecializationData(expertiseId, specializationId);
  }
});
</script>
