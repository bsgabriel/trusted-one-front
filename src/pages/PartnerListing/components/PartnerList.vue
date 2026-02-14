<template>
  <PaginatedList
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :items="partners"
    :loading="isLoading"
    :error="error"
    :total-pages="totalPages"
    :total-elements="totalElements"
    title="Lista de Parceiros"
    loading-text="Carregando parceiros..."
    error-title="Erro ao carregar parceiros"
    empty-text="Nenhum parceiro cadastrado"
    empty-hint="Clique em 'Novo Parceiro' para começar"
    item-key="partnerId"
    entity-name="parceiro"
    @update:page-size="onPageSizeChange"
    @update:current-page="onPageChange"
    @retry="fetchPartners"
  >
    <template #filters>
      <!-- Busca -->
      <div class="col-12">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Buscar parceiros..."
          clearable
          @update:model-value="onSearchChange"
          @clear="clearSearch"
        >
          <template #prepend>
            <q-icon name="search" />
          </template>
        </q-input>
      </div>
    </template>

    <!-- Item do parceiro -->
    <template #item="{ item }">
      <q-item clickable v-ripple @click="goToPartnerDetails(item.partnerId)" class="q-py-md">
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white" size="48px">
            {{ getInitials(item.name) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">
            {{ item.name }}
          </q-item-label>

          <q-item-label caption class="q-mt-xs">
            <div class="row items-center q-gutter-sm">
              <div v-if="item.company" class="row items-center q-gutter-xs">
                <q-icon name="business" size="14px" />
                <span>{{ item.company.name }}</span>
              </div>
              <span v-if="item.company && item.group" class="text-grey-5">•</span>
              <div v-if="item.group" class="row items-center q-gutter-xs">
                <q-icon name="group" size="14px" />
                <span>{{ item.group.name }}</span>
              </div>
            </div>
          </q-item-label>

          <div class="q-mt-sm row q-gutter-sm">
            <q-badge
              v-if="hasReferrals(item)"
              color="orange-3"
              text-color="orange-9"
              :label="`${item.metrics.pendingReferrals} pendente${item.metrics.pendingReferrals !== 1 ? 's' : ''}`"
            />
            <q-badge
              v-if="hasReferrals(item)"
              color="green-3"
              text-color="green-9"
              :label="`${item.metrics.acceptedReferrals} aprovada${item.metrics.acceptedReferrals !== 1 ? 's' : ''}`"
            />
            <q-badge
              v-if="hasReferrals(item)"
              color="red-3"
              text-color="red-9"
              :label="`${item.metrics.rejectedReferrals} recusada${item.metrics.rejectedReferrals !== 1 ? 's' : ''}`"
            />
            <q-badge
              v-if="!hasReferrals(item)"
              color="grey-3"
              text-color="grey-7"
              label="Ainda não foi indicado"
            />
          </div>
        </q-item-section>

        <q-item-section side>
          <q-icon name="chevron_right" color="grey-5" />
        </q-item-section>
      </q-item>
    </template>
  </PaginatedList>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { partnerService } from 'src/services/partnerService';
import type { PartnerListing } from 'src/types/partner';
import PaginatedList from 'src/components/PaginatedList.vue';
import { useApiError } from 'src/composables/useApiError';
import { useAppRouter } from 'src/composables/useAppRouter';
import { PAGES } from 'src/constants/pages';

const { navigate } = useAppRouter();
const partners = ref<PartnerListing[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(0);
const totalElements = ref(0);
const searchQuery = ref('');
const { notifyError } = useApiError();

let searchDebounceTimer: NodeJS.Timeout | null = null;

const fetchPartners = () => {
  partners.value = [];
  isLoading.value = true;
  error.value = null;

  partnerService
    .listPartners({
      page: currentPage.value - 1,
      size: pageSize.value,
      search: searchQuery.value || undefined,
    })
    .then((result) => {
      partners.value = result.content;
      totalPages.value = result.totalPages;
      totalElements.value = result.totalElements;
    })
    .catch((err) => {
      error.value = 'Erro ao carregar parceiros';
      partners.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      notifyError(err);
    })
    .finally(() => (isLoading.value = false));
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchPartners();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageSizeChange = () => {
  currentPage.value = 1;
  fetchPartners();
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchPartners();
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchPartners();
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const hasReferrals = (partner: PartnerListing): boolean => {
  return (
    partner.metrics.pendingReferrals > 0 ||
    partner.metrics.acceptedReferrals > 0 ||
    partner.metrics.rejectedReferrals > 0
  );
};

const goToPartnerDetails = (partnerId: number) => {
  navigate(PAGES.EDIT_PARTNER, { id: partnerId });
};

onMounted(() => {
  fetchPartners();
});
</script>
