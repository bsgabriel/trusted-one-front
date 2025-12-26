<template>
  <PaginatedList
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :items="parentExpertises"
    :loading="isLoading"
    :error="error"
    :total-pages="totalPages"
    :total-elements="totalElements"
    title="Lista de Especializações"
    loading-text="Carregando especializações..."
    error-title="Erro ao carregar especializações"
    empty-icon="group_work"
    empty-text="Nenhuma especialização cadastrada"
    empty-hint="Clique em 'Nova Especialização' para começar"
    item-key="expertiseId"
    entity-name="especialização"
    @update:page-size="onPageSizeChange"
    @update:current-page="onPageChange"
    @retry="fetchParentExpertises"
  >
    <template #filters>
      <div class="col-12">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Buscar especializações..."
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

    <template #item="{ item }">
      <q-item clickable v-ripple @click="goToExpertise(item.expertiseId)" class="q-py-md">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">
            {{ item.name }}
          </q-item-label>

          <div class="q-mt-sm">
            <q-badge
              :color="item.specializationCount > 0 ? 'primary' : 'grey-3'"
              :text-color="item.specializationCount > 0 ? 'white' : 'grey-7'"
            >
              {{
                item.specializationCount > 0
                  ? `${item.specializationCount} sub-especializaç${item.specializationCount !== 1 ? 'ões' : 'ão'}`
                  : 'Sem sub-especializações'
              }}
            </q-badge>
          </div>
        </q-item-section>
      </q-item>
    </template>
  </PaginatedList>
</template>

<script setup lang="ts">
import type { ExpertiseListing } from 'src/types/expertise';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { expertiseService } from 'src/services/expertiseService';
import { useApiError } from 'src/composables/useApiError';
import PaginatedList from 'src/components/PaginatedList.vue';

const { notifyError } = useApiError();
const router = useRouter();

const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(0);
const totalElements = ref(0);
const searchQuery = ref('');
const isLoading = ref(false);
const error = ref<string | null>(null);
const parentExpertises = ref<ExpertiseListing[]>([]);
const expandedIds = ref<Set<number>>(new Set());
const childrenCache = ref<Map<number, ExpertiseListing[]>>(new Map());

let searchDebounceTimer: NodeJS.Timeout | null = null;

const fetchParentExpertises = () => {
  isLoading.value = true;
  error.value = null;

  expertiseService
    .listExpertises({
      page: currentPage.value - 1,
      size: pageSize.value,
      search: searchQuery.value || undefined,
    })
    .then((response) => {
      parentExpertises.value = response.content;
      totalPages.value = response.totalPages;
      totalElements.value = response.totalElements;
    })
    .catch((err) => {
      error.value = 'Erro ao carregar especializações';
      notifyError(err);
    })
    .finally(() => {
      isLoading.value = false;
    });
};

const goToExpertise = (expertiseId: number) => {
  void router.push(`/especializacoes/${expertiseId}`);
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchParentExpertises();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageSizeChange = () => {
  currentPage.value = 1;
  fetchParentExpertises();
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    expandedIds.value.clear();
    childrenCache.value.clear();
    fetchParentExpertises();
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  expandedIds.value.clear();
  childrenCache.value.clear();
  fetchParentExpertises();
};

onMounted(() => {
  fetchParentExpertises();
});
</script>
