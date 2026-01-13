<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="groups" class="q-mr-sm gt-xs" />
          {{ isEditing ? 'Editar Grupo' : 'Novo Grupo' }}
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          {{
            isEditing
              ? 'Atualize as informações do grupo'
              : 'Cadastre um novo grupo para organizar seus parceiros'
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
            <q-item-label class="text-h6">Dados do Grupo</q-item-label>
            <q-item-label caption>Nome e descrição</q-item-label>
          </q-item-section>
        </q-item>

        <!-- Nome -->
        <q-input
          v-model="form.name"
          label="Nome *"
          outlined
          :rules="[(val) => !!val || 'Nome é obrigatório']"
        />

        <!-- Descrição -->
        <q-input v-model="form.description" label="Descrição" outlined class="q-mt-md" />

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
              </q-item-section>
            </q-item>
          </q-list>
        </q-expansion-item>

        <!-- Botões de Ação -->
        <div class="row items-center q-mt-lg">
          <q-btn
            v-if="isEditing"
            label="Excluir Grupo"
            color="negative"
            @click="deleteGroup"
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
import type { GroupFormRequest, GroupPartner } from 'src/types/group';
import type { GroupForm, GroupPartnerForm } from './types/formData';
import type { PartnerListing } from 'src/types/partner';
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { useQuasar } from 'quasar';
import { groupService } from 'src/services/groupService';
import { useApiError } from 'src/composables/useApiError';
import { useDialog } from 'src/composables/useDialog';
import { useNotification } from 'src/composables/useNotification';
import PartnerSelectionDialog from './components/PartnerSelectionDialog.vue';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from 'src/composables/useAppRouter';

const { navigate, router } = useAppRouter();
const route = useRoute();
const $q = useQuasar();
const isEditing = computed(() => !!route.params.id);
const isLoading = ref(false);
const selectedPartners = ref<number[]>([]);
const showPartnerDialog = ref(false);
const { notifyError } = useApiError();
const { showConfirm } = useDialog();
const { showSuccess } = useNotification();

const form = ref<GroupForm>({
  name: '',
  partners: [],
});

const getPartnerListCaption = () => {
  const count = form.value.partners?.length || 0;
  if (count === 0) {
    return 'Nenhum parceiro foi adicionado à este grupo';
  }
  return `${count} parceiro${count === 1 ? '' : 's'} adicionado${count === 1 ? '' : 's'}`;
};

const loadGroupData = (groupId: number) => {
  const mapGroupPartner = (partner: GroupPartner): GroupPartnerForm => ({
    partnerId: partner.partnerId,
    name: partner.name,
  });

  isLoading.value = true;
  groupService
    .fetchGroupById(groupId)
    .then((result) => {
      form.value.groupId = groupId;
      form.value.name = result.name;
      form.value.description = result.description;
      form.value.partners = result.partners.map(mapGroupPartner);
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

const clearSelection = () => {
  selectedPartners.value = [];
};

const removePartners = () => {
  const count = selectedPartners.value.length;
  const isRemovingAll = count === form.value.partners.length || count === 0;

  const message = isRemovingAll
    ? 'Deseja remover TODOS os parceiros deste grupo?'
    : `Deseja remover ${count} parceiro${count === 1 ? '' : 's'} deste grupo?`;

  showConfirm(message, 'Remover Parceiros').onOk(() => {
    if (isRemovingAll) {
      form.value.partners = [];
    } else {
      form.value.partners = form.value.partners.filter(
        (partner) => !selectedPartners.value.includes(partner.partnerId),
      );
      clearSelection();
    }
  });
};

const goToPartnerDetails = (partnerId: number) => {
  navigate(PAGES.EDIT_PARTNER, { id: partnerId });
};

const onDialogPartnersSelected = (partners: PartnerListing[]) => {
  const newPartners = partners.map((partner) => ({
    partnerId: partner.partnerId,
    name: partner.name,
  }));

  form.value.partners.push(...newPartners);
  form.value.partners.sort((a, b) => a.name.localeCompare(b.name));
};

const createGroupFormRequest = (form: GroupForm): GroupFormRequest => {
  return {
    groupId: form.groupId,
    name: form.name,
    description: form.description?.trim() || undefined,
    partners: form.partners.map((p) => p.partnerId),
  };
};

const onSubmit = () => {
  if (isEditing.value) {
    updateGroup();
  } else {
    createGroup();
  }
};

const updateGroup = () => {
  isLoading.value = true;
  groupService
    .updateGroup(createGroupFormRequest(form.value))
    .then(() => {
      showSuccess('Grupo atualizado com sucesso');
      navigate(PAGES.GROUPS);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const createGroup = () => {
  isLoading.value = true;
  groupService
    .createGroup(createGroupFormRequest(form.value))
    .then(() => {
      showSuccess('Grupo criado com sucesso');
      navigate(PAGES.GROUPS);
    })
    .catch((err) => notifyError(err))
    .finally(() => (isLoading.value = false));
};

const deleteGroup = () => {
  const partnerCount = form.value.partners.length;
  const message =
    partnerCount > 0
      ? `Os ${partnerCount} parceiro${partnerCount === 1 ? '' : 's'} ficarão sem grupo vinculado.`
      : undefined;

  showConfirm('Deseja realmente excluir este grupo?', 'Excluir Grupo', message).onOk(() => {
    groupService
      .deleteGroup(form.value.groupId!)
      .then(() => {
        showSuccess('Grupo excluído com sucesso');
        navigate(PAGES.GROUPS);
      })
      .catch((err) => {
        notifyError(err);
      });
  });
};

onMounted(() => {
  if (isEditing.value) {
    const groupId = Number(route.params.id);
    loadGroupData(groupId);
  }
});
</script>
