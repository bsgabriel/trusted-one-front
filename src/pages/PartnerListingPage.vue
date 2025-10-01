<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="people" class="q-mr-sm gt-xs" />
          Parceiros
        </h4>
        <p class="text-grey-7 q-ma-none" :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'">
          Gerencie sua rede de parceiros profissionais
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          :label="$q.screen.gt.xs ? 'Novo Parceiro' : ''"
          @click="showAddPartner"
          unelevated
          :round="$q.screen.xs"
        >
          <q-tooltip v-if="$q.screen.xs">Novo Parceiro</q-tooltip>
        </q-btn>
      </div>
    </div>

    <q-card>
      <q-card-section class="q-pb-none">
        <div class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-8">
            <q-input
              v-model="searchQuery"
              outlined
              dense
              placeholder="Buscar parceiros..."
              @update:model-value="onSearchChange"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
              <template v-slot:append>
                <q-icon
                  v-if="searchQuery"
                  name="close"
                  class="cursor-pointer"
                  @click="clearSearch"
                />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-4">
            <q-select
              v-model="pageSize"
              :options="pageSizeOptions"
              outlined
              dense
              @update:model-value="onPageSizeChange"
              label="Itens por página"
            />
          </div>
        </div>

        <div class="row items-center justify-between q-mt-md">
          <div class="col">
            <div class="text-h6">Lista de Parceiros</div>
            <div class="text-caption text-grey-6">
              {{ paginationInfo }}
            </div>
          </div>
        </div>
      </q-card-section>

      <q-separator class="q-mt-md" />

      <!-- Loading State -->
      <q-card-section v-if="isLoading && partners.length === 0">
        <div class="text-center q-py-lg">
          <q-spinner color="primary" size="3rem" />
          <div class="text-body1 text-grey-6 q-mt-md">Carregando parceiros...</div>
        </div>
      </q-card-section>

      <!-- Error State -->
      <q-card-section v-else-if="error">
        <div class="text-center q-py-lg">
          <q-icon name="error_outline" size="4rem" color="negative" />
          <div class="text-h6 q-mt-md text-negative">Erro ao carregar parceiros</div>
          <div class="text-body2 text-grey-6 q-mt-sm">{{ error }}</div>
          <q-btn
            color="primary"
            label="Tentar novamente"
            @click="fetchPartners"
            class="q-mt-md"
            outline
          />
        </div>
      </q-card-section>

      <!-- Empty State -->
      <q-card-section v-else-if="partners.length === 0">
        <div class="text-center q-py-lg">
          <q-icon name="person_add" size="4rem" color="grey-5" />
          <div class="text-h6 q-mt-md text-grey-6">
            {{ searchQuery ? 'Nenhum parceiro encontrado' : 'Nenhum parceiro cadastrado' }}
          </div>
          <div class="text-body2 text-grey-5 q-mt-sm">
            {{ searchQuery ? 'Tente buscar com outros termos' : 'Clique em "Novo Parceiro" para começar' }}
          </div>
        </div>
      </q-card-section>

      <!-- Partners List -->
      <div v-else>
        <q-list separator>
          <q-item
            v-for="partner in partners"
            :key="partner.partnerId"
            clickable
            v-ripple
            @click="goToPartnerDetails(partner.partnerId)"
            class="q-py-md"
          >
            <q-item-section avatar>
              <q-avatar color="primary" text-color="white" size="48px">
                {{ getInitials(partner.name) }}
              </q-avatar>
            </q-item-section>

            <q-item-section>
              <q-item-label class="text-weight-medium text-body1">
                {{ partner.name }}
              </q-item-label>

              <q-item-label caption class="q-mt-xs">
                <div class="row items-center q-gutter-sm">
                  <div v-if="partner.company" class="row items-center q-gutter-xs">
                    <q-icon name="business" size="14px" />
                    <span>{{ partner.company.name }}</span>
                  </div>
                  <span v-if="partner.company && partner.group" class="text-grey-5">•</span>
                  <div v-if="partner.group" class="row items-center q-gutter-xs">
                    <q-icon name="group" size="14px" />
                    <span>{{ partner.group.name }}</span>
                  </div>
                </div>
              </q-item-label>

              <div class="q-mt-sm row q-gutter-sm">
                <q-badge
                  v-if="hasReferrals(partner)"
                  color="orange-3"
                  text-color="orange-9"
                  :label="`${partner.metrics.pendingReferrals} pendente${partner.metrics.pendingReferrals !== 1 ? 's' : ''}`"
                />
                <q-badge
                  v-if="hasReferrals(partner)"
                  color="green-3"
                  text-color="green-9"
                  :label="`${partner.metrics.acceptedReferrals} aprovada${partner.metrics.acceptedReferrals !== 1 ? 's' : ''}`"
                />
                <q-badge
                  v-if="hasReferrals(partner)"
                  color="red-3"
                  text-color="red-9"
                  :label="`${partner.metrics.rejectedReferrals} recusada${partner.metrics.rejectedReferrals !== 1 ? 's' : ''}`"
                />
                <q-badge
                  v-if="!hasReferrals(partner)"
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
        </q-list>

        <!-- Pagination -->
        <q-card-section class="q-pt-md">
          <div class="row justify-center">
            <q-pagination
              v-model="currentPage"
              :max="totalPages"
              :max-pages="5"
              direction-links
              boundary-links
              @update:model-value="onPageChange"
              :disable="isLoading"
            />
          </div>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>


<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { partnerService } from '../services/partnerService';
import type { Partner } from '../types/partner';

const $q = useQuasar();
const router = useRouter();

// Estado
const partners = ref<Partner[]>([]);
const isLoading = ref(false);
const error = ref<string | null>(null);

// Paginação
const currentPage = ref(1);
const pageSize = ref(20);
const totalPages = ref(0);
const totalElements = ref(0);
const pageSizeOptions = [10, 20, 50, 100];

// Busca
const searchQuery = ref('');
let searchDebounceTimer: NodeJS.Timeout | null = null;

// Computed
const paginationInfo = computed(() => {
  if (totalElements.value === 0) return '0 parceiros';
  
  const start = (currentPage.value - 1) * pageSize.value + 1;
  const end = Math.min(currentPage.value * pageSize.value, totalElements.value);
  
  return `Mostrando ${start}-${end} de ${totalElements.value} parceiro${totalElements.value !== 1 ? 's' : ''}`;
});

// Métodos
const fetchPartners = async () => {
  isLoading.value = true;
  error.value = null;

  try {
    const result = await partnerService.listPartners({
      page: currentPage.value - 1, // Spring usa página baseada em 0
      size: pageSize.value,
      search: searchQuery.value || undefined,
    });

    if (result.success) {
      partners.value = result.data.content;
      totalPages.value = result.data.totalPages;
      totalElements.value = result.data.totalElements;
    } else {
      error.value = result.message || 'Erro ao carregar parceiros';
      partners.value = [];
      totalPages.value = 0;
      totalElements.value = 0;
    }
  } catch (err) {
    error.value = 'Erro ao conectar com o servidor';
    partners.value = [];
    totalPages.value = 0;
    totalElements.value = 0;
    console.error('Erro ao buscar parceiros:', err);
  } finally {
    isLoading.value = false;
  }
};

const onPageChange = (page: number) => {
  currentPage.value = page;
  void fetchPartners();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const onPageSizeChange = () => {
  currentPage.value = 1;
  void fetchPartners();
};

const onSearchChange = () => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
  
  searchDebounceTimer = setTimeout(() => {
    currentPage.value = 1;
    void fetchPartners();
  }, 500); // Aguarda 500ms após o usuário parar de digitar
};

const clearSearch = () => {
  searchQuery.value = '';
  currentPage.value = 1;
  void fetchPartners();
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const hasReferrals = (partner: Partner): boolean => {
  return (
    partner.metrics.pendingReferrals > 0 ||
    partner.metrics.acceptedReferrals > 0 ||
    partner.metrics.rejectedReferrals > 0
  );
};

const goToPartnerDetails = (partnerId: string) => {
  void router.push(`/partner/${partnerId}`);
};

const showAddPartner = () => {
  $q.notify({
    message: 'Funcionalidade em desenvolvimento!',
    color: 'info',
    icon: 'info',
  });
};

// Lifecycle
onMounted(() => {
  void void fetchPartners();
});
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}

.q-item {
  transition: background-color 0.2s ease;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>