<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="history" class="q-mr-sm gt-xs" />
          Histórico de Indicações
        </h4>
      </div>
      <q-space />
      <q-btn label="Nova Indicação" color="primary" icon="add" @click="router.push('/indicar')" />
    </div>

    <PaginatedList
      v-model:page-size="pageSize"
      v-model:current-page="currentPage"
      :items="referrals"
      :loading="isLoading"
      :error="error"
      :total-pages="totalPages"
      :total-elements="totalElements"
      title="Indicações"
      loading-text="Carregando indicações..."
      error-title="Erro ao carregar indicações"
      empty-icon="inbox"
      empty-text="Nenhuma indicação encontrada"
      empty-hint="Faça sua primeira indicação!"
      item-key="referralId"
      entity-name="indicação"
      @page-size-change="loadReferrals"
      @page-change="loadReferrals"
      @retry="loadReferrals"
    >
      <!-- Filtros -->
      <template #filters>
        <div class="col-12 col-md-7">
          <q-input
            v-model="filters.search"
            outlined
            dense
            placeholder="Nome do parceiro ou indicado"
            clearable
            @update:model-value="onSearchChange"
          >
            <template #prepend>
              <q-icon name="search" />
            </template>
          </q-input>
        </div>

        <div class="col-12 col-md-2">
          <q-select
            v-model="filters.status"
            label="Status"
            :options="statusOptions"
            outlined
            dense
            clearable
            emit-value
            map-options
            @update:model-value="onFilterChange"
          >
            <template #prepend>
              <q-icon name="filter_list" />
            </template>
          </q-select>
        </div>

        <div class="col-12 col-md-3">
          <q-select
            v-model="filters.sortBy"
            label="Ordenar por"
            :options="sortOptions"
            outlined
            dense
            emit-value
            map-options
            @update:model-value="onFilterChange"
          >
            <template #prepend>
              <q-icon name="sort" />
            </template>
          </q-select>
        </div>
      </template>

      <!-- Item da indicação -->
      <template #item="{ item }">
        <q-item clickable @click="viewDetails(item)" class="q-py-md">
          <q-item-section avatar>
            <q-avatar :color="getStatusColor(item.status)" text-color="white" size="48px">
              <q-icon :name="getStatusIcon(item.status)" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium text-body1">
              {{ item.partnerName }}
            </q-item-label>
            <q-item-label caption class="q-mt-xs">
              {{ formatExpertise(item.expertise, item.specialization) }}
            </q-item-label>
            <q-item-label caption class="q-mt-xs">
              <strong>Indicado para:</strong> {{ item.referredTo }}
            </q-item-label>
          </q-item-section>

          <q-item-section side class="items-end">
            <q-chip :color="getStatusColor(item.status)" text-color="white" size="sm">
              {{ getStatusLabel(item.status) }}
            </q-chip>
            <q-item-label caption class="q-mt-sm">
              {{ item.createdAt.toLocaleDateString('pt-BR') }}
            </q-item-label>
            <q-item-label v-if="item.updatedAt.getTime() !== item.createdAt.getTime()" caption>
              Atualizado: {{ item.updatedAt.toLocaleDateString('pt-BR') }}
            </q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-icon name="chevron_right" color="grey-5" />
          </q-item-section>
        </q-item>
      </template>
    </PaginatedList>

    <!-- Dialog de detalhes -->
    <q-dialog v-model="showDetailsDialog">
      <q-card style="min-width: 460px">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Detalhes da Indicação</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section v-if="selectedReferral">
          <q-list>
            <q-item>
              <q-item-section>
                <q-item-label caption>Parceiro</q-item-label>
                <q-item-label>{{ selectedReferral.partnerName }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Área de Indicação</q-item-label>
                <q-item-label>
                  {{ formatExpertise(selectedReferral.expertise, selectedReferral.specialization) }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Indicado Para</q-item-label>
                <q-item-label>{{ selectedReferral.referredTo }}</q-item-label>
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section>
                <q-item-label caption>Data de Criação</q-item-label>
                <q-item-label>
                  {{ selectedReferral.createdAt.toLocaleString('pt-BR') }}
                </q-item-label>
              </q-item-section>
            </q-item>

            <q-item v-if="selectedReferral.status !== 'PENDING'">
              <q-item-section>
                <q-item-label caption>Última Atualização</q-item-label>
                <q-item-label>
                  {{ selectedReferral.updatedAt.toLocaleString('pt-BR') }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </q-list>

          <!-- Ações de atualização de status -->
          <template v-if="selectedReferral.status === 'PENDING'">
            <q-separator class="q-my-md" />

            <div class="text-caption text-grey-7 q-mb-sm">Atualizar Status:</div>

            <div class="row q-gutter-sm">
              <q-btn
                label="Aceitar Indicação"
                color="green"
                icon="check_circle"
                :loading="updatingStatus"
                :disable="updatingStatus"
                @click="updateStatus('ACCEPTED')"
                class="col"
              />

              <q-btn
                label="Recusar Indicação"
                color="red"
                icon="cancel"
                :loading="updatingStatus"
                :disable="updatingStatus"
                @click="updateStatus('DECLINED')"
                class="col"
              />
            </div>
          </template>

          <q-banner v-else class="bg-grey-2 q-mt-md" dense rounded>
            <template #avatar>
              <q-icon
                :name="getStatusIcon(selectedReferral.status)"
                :color="getStatusColor(selectedReferral.status)"
              />
            </template>
            Esta indicação já foi
            {{ selectedReferral.status === 'ACCEPTED' ? 'aceita' : 'recusada' }} e não pode mais ser
            alterada.
          </q-banner>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn label="Fechar" color="primary" flat v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { referralService } from 'src/services/referralService';
import type { Referral, ReferralStatus } from 'src/types/referral';
import PaginatedList from 'src/components/PaginatedList.vue';
import { useApiError } from 'src/composables/useApiError';
import { useNotification } from 'src/composables/useNotification';

const router = useRouter();
const referrals = ref<Referral[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(10);
const totalPages = ref(0);
const totalElements = ref(0);
const showDetailsDialog = ref(false);
const selectedReferral = ref<Referral | null>(null);
const updatingStatus = ref(false);
const { notifyError } = useApiError();
const { showSuccess } = useNotification();

const filters = ref({
  search: '',
  status: null as ReferralStatus | null,
  sortBy: 'RECENT',
});

const statusOptions = [
  { label: 'Pendente', value: 'PENDING' },
  { label: 'Aceita', value: 'ACCEPTED' },
  { label: 'Recusada', value: 'DECLINED' },
];

const sortOptions = [
  { label: 'Mais Recentes', value: 'RECENT' },
  { label: 'Mais Antigas', value: 'OLDEST' },
  { label: 'Nome do Parceiro', value: 'PARTNER_NAME' },
];

let searchDebounceTimer: NodeJS.Timeout | null = null;

const loadReferrals = () => {
  referrals.value = [];
  isLoading.value = true;
  error.value = null;

  referralService
    .listReferrals({
      page: currentPage.value - 1,
      size: pageSize.value,
      search: filters.value.search || undefined,
      status: filters.value.status || undefined,
      sortBy: filters.value.sortBy,
    })
    .then((result) => {
      referrals.value = result.content.map((r) => ({
        ...r,
        createdAt: new Date(r.createdAt),
        updatedAt: new Date(r.updatedAt),
      }));
      totalPages.value = result.totalPages;
      totalElements.value = result.totalElements;
    })
    .catch((err) => {
      error.value = 'Erro ao conectar com o servidor';
      referrals.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      notifyError(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const updateStatus = (newStatus: ReferralStatus) => {
  const referral = selectedReferral.value;

  if (!referral) {
    return;
  }

  updatingStatus.value = true;

  referralService
    .updateReferralStatus(referral.referralId, newStatus)
    .then((result) => {
      referral.status = result.status;
      referral.updatedAt = new Date(result.updatedAt);

      const index = referrals.value.findIndex((r) => r.referralId === referral.referralId);

      if (index !== -1) {
        referrals.value[index] = { ...referral };
      }
      showSuccess('Status atualizado com sucesso!');
    })
    .catch(notifyError)
    .finally(() => (updatingStatus.value = false));
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    loadReferrals();
  }, 500);
};

const onFilterChange = () => {
  currentPage.value = 1;
  loadReferrals();
};

const getStatusColor = (status: ReferralStatus): string => {
  const colors = {
    PENDING: 'orange',
    ACCEPTED: 'green',
    DECLINED: 'red',
  };
  return colors[status] || 'grey';
};

const getStatusIcon = (status: ReferralStatus): string => {
  const icons = {
    PENDING: 'schedule',
    ACCEPTED: 'check_circle',
    DECLINED: 'cancel',
  };
  return icons[status] || 'help';
};

const getStatusLabel = (status: ReferralStatus): string => {
  const labels = {
    PENDING: 'Pendente',
    ACCEPTED: 'Aceita',
    DECLINED: 'Recusada',
  };
  return labels[status] || status;
};

const formatExpertise = (expertise: string, specialization?: string): string => {
  return specialization ? `${expertise} (${specialization})` : expertise;
};

const viewDetails = (referral: Referral) => {
  selectedReferral.value = referral;
  showDetailsDialog.value = true;
};

onMounted(() => {
  loadReferrals();
});
</script>
