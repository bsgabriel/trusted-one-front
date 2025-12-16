<template>
  <PaginatedList
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :items="companies"
    :loading="isLoading"
    :error="error"
    :total-pages="totalPages"
    :total-elements="totalElements"
    title="Lista de Empresas"
    loading-text="Carregando empresas..."
    error-title="Erro ao carregar empresas"
    empty-icon="domain_disabled"
    empty-text="Nenhuma empresa cadastrada"
    empty-hint="Clique em 'Nova Empresa' para começar"
    item-key="id"
    entity-name="empresa"
    @update:page-size="onPageSizeChange"
    @update:current-page="onPageChange"
    @retry="fetchCompanies"
  >
    <template #filters>
      <!-- Busca -->
      <div class="col-12">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Buscar empresas..."
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

    <!-- Item do empresa -->
    <template #item="{ item }">
      <q-item clickable v-ripple @click="goToCompanyDetails(item.companyId)" class="q-py-md">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">
            {{ item.name }}
          </q-item-label>

          <div class="q-mt-sm">
            <q-badge
              :color="item.partnerCount > 0 ? 'primary' : 'grey-3'"
              :text-color="item.partnerCount > 0 ? 'white' : 'grey-7'"
            >
              {{
                item.partnerCount > 0
                  ? `${item.partnerCount} membro${item.partnerCount !== 1 ? 's' : ''}`
                  : 'Sem membros'
              }}
            </q-badge>
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
import type { CompanyListing } from 'src/types/company';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PaginatedList from 'src/components/PaginatedList.vue';
import { companyService } from 'src/services/companyService';
import { useApiError } from 'src/composables/useApiError';

const router = useRouter();
const companies = ref<CompanyListing[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(0);
const totalElements = ref(0);
const searchQuery = ref('');
const { notifyError } = useApiError();

let searchDebounceTimer: NodeJS.Timeout | null = null;

const fetchCompanies = () => {
  companies.value = [];
  isLoading.value = true;
  error.value = null;

  companyService
    .listCompanies({
      page: currentPage.value - 1,
      size: pageSize.value,
      search: searchQuery.value || undefined,
    })
    .then((result) => {
      companies.value = result.content;
      totalPages.value = result.totalPages;
      totalElements.value = result.totalElements;
    })
    .catch((err) => {
      error.value = 'Erro ao carregar empresas';
      companies.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      notifyError(err);
    })
    .finally(() => (isLoading.value = false));
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchCompanies();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageSizeChange = () => {
  currentPage.value = 1;
  fetchCompanies();
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchCompanies();
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchCompanies();
};

const goToCompanyDetails = (id: number) => {
  void router.push(`/empresas/${id}`);
};

onMounted(() => {
  fetchCompanies();
});
</script>
