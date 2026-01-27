<template>
  <PaginatedList
    v-model:page-size="pageSize"
    v-model:current-page="currentPage"
    :items="grupos"
    :loading="isLoading"
    :error="error"
    :total-pages="totalPages"
    :total-elements="totalElements"
    title="Lista de Grupos"
    loading-text="Carregando grupos..."
    error-title="Erro ao carregar grupos"
    empty-icon="group_work"
    empty-text="Nenhum grupo cadastrado"
    empty-hint="Clique em 'Novo Grupo' para começar"
    item-key="id"
    entity-name="grupo"
    @update:page-size="onPageSizeChange"
    @update:current-page="onPageChange"
    @retry="fetchGroups"
  >
    <template #filters>
      <!-- Busca -->
      <div class="col-12">
        <q-input
          v-model="searchQuery"
          outlined
          dense
          placeholder="Buscar grupos..."
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

    <!-- Item do grupo -->
    <template #item="{ item }">
      <q-item clickable v-ripple @click="goToGroupDetails(item.groupId)" class="q-py-md">
        <q-item-section>
          <q-item-label class="text-weight-medium text-body1">
            {{ item.name }}
          </q-item-label>

          <q-item-label caption class="q-mt-xs">
            {{ item.description || 'Sem descrição' }}
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
import type { GroupListing } from 'src/types/group';
import { ref, onMounted } from 'vue';
import PaginatedList from 'src/components/PaginatedList.vue';
import { groupService } from 'src/services/groupService';
import { useApiError } from 'src/composables/useApiError';
import { useAppRouter } from 'src/composables/useAppRouter';
import { PAGES } from 'src/constants/pages';

const grupos = ref<GroupListing[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(0);
const totalElements = ref(0);
const searchQuery = ref('');
const { notifyError } = useApiError();
const { navigate } = useAppRouter();

let searchDebounceTimer: NodeJS.Timeout | null = null;

const fetchGroups = () => {
  grupos.value = [];
  isLoading.value = true;
  error.value = null;

  groupService
    .listGroups({
      page: currentPage.value - 1,
      size: pageSize.value,
      search: searchQuery.value || undefined,
    })
    .then((result) => {
      grupos.value = result.content;
      totalPages.value = result.totalPages;
      totalElements.value = result.totalElements;
    })
    .catch((err) => {
      error.value = 'Erro ao carregar grupos';
      grupos.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
      notifyError(err);
    })
    .finally(() => (isLoading.value = false));
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  fetchGroups();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageSizeChange = () => {
  currentPage.value = 1;
  fetchGroups();
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    fetchGroups();
  }, 500);
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  fetchGroups();
};

const goToGroupDetails = (id: number) => {
  navigate(PAGES.EDIT_GROUP, { id: id });
};

onMounted(() => {
  fetchGroups();
});
</script>
