<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="school" class="q-mr-sm gt-xs" />
          {{ isEditing ? 'Editar Área de Atuação' : 'Nova Área de Atuação' }}
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          {{
            isEditing
              ? 'Atualize as informações da área de atuação'
              : 'Cadastre uma nova área de atuação para organizar especializações'
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
            <q-item-label class="text-h6">Dados da Área de Atuação</q-item-label>
            <q-item-label caption>Nome</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Nome -->
        <q-input
          v-model="form.name"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Nome é obrigatório']"
        />

        <!-- Lista de Especializações -->
        <q-expansion-item
          default-opened
          icon="category"
          label="Especializações"
          :caption="getSpecializationListCaption()"
          header-class="bg-grey-3 text-h6 q-mt-md"
        >
          <div class="q-pa-md bg-grey-2">
            <div v-if="selectedSpecializations.length === 0" class="q-gutter-sm">
              <q-btn
                label="Adicionar Especialização"
                icon="add"
                color="primary"
                unelevated
                @click="showSpecializationDialog = true"
              />
              <q-btn
                v-if="form.specializations.length"
                label="Remover Especializações"
                icon="delete"
                color="negative"
                outline
                @click="removeSpecializations"
              />
            </div>
            <div v-else class="q-gutter-sm">
              <q-btn
                label="Remover Selecionadas"
                icon="delete"
                color="negative"
                outline
                @click="removeSpecializations"
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
              v-for="specialization in form.specializations"
              :key="specialization.expertiseId"
              clickable
              v-ripple
              @click="goToSpecializationDetails(specialization.expertiseId)"
              class="q-py-md"
            >
              <q-item-section side>
                <q-checkbox
                  :model-value="selectedSpecializations.includes(specialization.expertiseId)"
                  @update:model-value="toggleSpecializationSelection(specialization.expertiseId)"
                  @click.stop
                />
              </q-item-section>

              <q-item-section>
                <q-item-label class="text-weight-medium text-body1">
                  {{ specialization.name }}
                </q-item-label>

                <div class="q-mt-sm">
                  <q-badge
                    :color="specialization.partnerCount > 0 ? 'primary' : 'grey-3'"
                    :text-color="specialization.partnerCount > 0 ? 'white' : 'grey-7'"
                  >
                    {{
                      specialization.partnerCount > 0
                        ? `${specialization.partnerCount} parceiro${specialization.partnerCount !== 1 ? 's' : ''}`
                        : 'Nenhum parceiro'
                    }}
                  </q-badge>
                </div>
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Botões de Ação -->
        <div class="row items-center q-mt-lg">
          <q-btn
            v-if="isEditing"
            label="Excluir Área de Atuação"
            color="negative"
            @click="deleteExpertise"
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
    <specializationDialog
      v-model="showSpecializationDialog"
      :exclude-specialization-ids="form.specializations.map((s) => s.expertiseId)"
      @confirm="onDialogSpecializationsSelected"
    />
  </q-page>
</template>

<script setup lang="ts">
import type { ExpertiseFormRequest, SpecializationListing } from 'src/types/expertise';
import type { ExpertiseForm, SpecializationListItem } from './types/formData';
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { expertiseService } from 'src/services/expertiseService';
import { useApiError } from 'src/composables/useApiError';
import { useDialog } from 'src/composables/useDialog';
import { useNotification } from 'src/composables/useNotification';
import SpecializationDialog from './components/SpecializationDialog.vue';
import { compareNormalized } from 'src/utils/stringUtils';

const router = useRouter();
const route = useRoute();
const $q = useQuasar();
const isEditing = computed(() => !!route.params.id);
const isLoading = ref(false);
const selectedSpecializations = ref<number[]>([]);
const showSpecializationDialog = ref(false);
const { notifyError } = useApiError();
const { showConfirm } = useDialog();
const { showSuccess } = useNotification();

const form = ref<ExpertiseForm>({
  name: '',
  specializations: [],
});

const getSpecializationListCaption = () => {
  const count = form.value.specializations?.length || 0;
  if (count === 0) {
    return 'Nenhuma especialização foi adicionada';
  }
  return `${count} especialização${count === 1 ? '' : 'ões'} adicionada${count === 1 ? '' : 's'}`;
};

const loadExpertiseData = (expertiseId: number) => {
  const mapSpecialization = (spec: SpecializationListing): SpecializationListItem => ({
    expertiseId: spec.expertiseId,
    name: spec.name,
    partnerCount: spec.partnerCount,
  });

  isLoading.value = true;
  expertiseService
    .fetchExpertise(expertiseId)
    .then((result) => {
      form.value.expertiseId = expertiseId;
      form.value.name = result.name;
      form.value.specializations = result.specializations.map(mapSpecialization);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const onDialogSpecializationsSelected = (specializations: SpecializationListItem[]) => {
  const newSpecializations = specializations.map((spec) => ({
    expertiseId: spec.expertiseId,
    name: spec.name,
    partnerCount: spec.partnerCount,
  })).filter((spec) => !form.value.specializations.some((existing) => existing.name.toLowerCase() === spec.name.toLowerCase()));

  form.value.specializations.push(...newSpecializations);
  form.value.specializations.sort((a, b) => compareNormalized(a.name, b.name));
};

const toggleSpecializationSelection = (expertiseId: number) => {
  const index = selectedSpecializations.value.indexOf(expertiseId);
  if (index > -1) {
    selectedSpecializations.value.splice(index, 1);
  } else {
    selectedSpecializations.value.push(expertiseId);
  }
};

const clearSelection = () => {
  selectedSpecializations.value = [];
};

const removeSpecializations = () => {
  const count = selectedSpecializations.value.length;
  const isRemovingAll = count === form.value.specializations.length || count === 0;

  const message = isRemovingAll
    ? 'Deseja remover TODAS as especializações desta expertise?'
    : `Deseja remover ${count} especialização${count === 1 ? '' : 'ões'} desta expertise?`;

  showConfirm(message, 'Remover Especializações').onOk(() => {
    if (isRemovingAll) {
      form.value.specializations = [];
    } else {
      form.value.specializations = form.value.specializations.filter(
        (spec: SpecializationListItem) => !selectedSpecializations.value.includes(spec.expertiseId),
      );
      clearSelection();
    }
  });
};

const goToSpecializationDetails = (specializationId: number) => {
  const navigate = (expertiseid: number, specializationId: number) => {
    void router.push(`/especializacoes/${expertiseid}/subespecializacao/${specializationId}`);
  };

  if (specializationId > 0) {
    navigate(form.value.expertiseId!, specializationId);
    return;
  }

  isLoading.value = true;
  expertiseService
    .createExpertise(createExpertiseFormRequest(form.value))
    .then((response) => {
      const temp = form.value.specializations.find((s) => s.expertiseId === specializationId);
      const spec = !temp ? undefined : response.specializations.find((s) => s.name === temp.name);
      if (!spec) {
        navigate(form.value.expertiseId!, specializationId);
      } else {
        navigate(response.expertiseId, spec.expertiseId);
      }
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const createExpertiseFormRequest = (form: ExpertiseForm): ExpertiseFormRequest => {
  return {
    name: form.name,
    specializations: form.specializations.map((spec) => ({
      parentExpertiseId: form.expertiseId!,
      expertiseId: spec.expertiseId,
      name: spec.name,
      partners: [],
    })),
  };
};

const onSubmit = () => {
  if (isEditing.value) {
    updateExpertise();
  } else {
    createExpertise();
  }
};

const updateExpertise = () => {
  isLoading.value = true;
  expertiseService
    .updateExpertise(form.value.expertiseId!, createExpertiseFormRequest(form.value))
    .then(() => {
      showSuccess('Área de atuação atualizada com sucesso');
      void router.push('/especializacoes');
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const createExpertise = () => {
  isLoading.value = true;
  expertiseService
    .createExpertise(createExpertiseFormRequest(form.value))
    .then(() => {
      showSuccess('Expertise criada com sucesso');
      void router.push('/especializacoes');
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const deleteExpertise = () => {
  const specializationCount = form.value.specializations.length;
  const message =
    specializationCount > 0
      ? `As ${specializationCount} especialização${specializationCount === 1 ? '' : 'ões'} serão excluídas junto.`
      : undefined;

  showConfirm('Deseja realmente excluir esta expertise?', 'Excluir Expertise', message).onOk(() => {
    expertiseService
      .deleteExpertise(form.value.expertiseId!)
      .then(() => {
        showSuccess('Expertise excluída com sucesso');
        void router.push('/especializacoes');
      })
      .catch((err) => {
        notifyError(err);
      });
  });
};

onMounted(() => {
  if (isEditing.value) {
    const expertiseId = Number(route.params.id);
    loadExpertiseData(expertiseId);
  }
});
</script>
