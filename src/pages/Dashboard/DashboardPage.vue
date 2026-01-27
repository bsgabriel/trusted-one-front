<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-lg">
      <div>
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="dashboard" class="q-mr-sm gt-xs" />
          Dashboard de Indicações
        </h4>
        <p class="text-caption text-grey-7 q-mt-xs q-mb-none">
          Acompanhe o desempenho das suas indicações
        </p>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading">
      <div class="row q-col-gutter-md">
        <div v-for="i in 4" :key="i" class="col-12 col-sm-6 col-md-3">
          <q-card>
            <q-card-section>
              <q-skeleton type="text" width="60%" />
              <q-skeleton type="text" width="40%" height="40px" class="q-mt-md" />
            </q-card-section>
          </q-card>
        </div>
      </div>
    </div>
    <div v-else>
      <!-- Stats Cards -->
      <div class="row q-col-gutter-md">
        <div class="col-12 col-sm-6 col-md-3">
          <StatsCard
            icon="people"
            color="primary"
            :value="stats.total"
            label="Total de Indicações"
          />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <StatsCard icon="check_circle" color="positive" :value="stats.accepted" label="Aceitas" />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <StatsCard icon="cancel" color="negative" :value="stats.declined" label="Recusadas" />
        </div>

        <div class="col-12 col-sm-6 col-md-3">
          <StatsCard icon="schedule" color="orange" :value="stats.pending" label="Pendentes" />
        </div>
      </div>

      <!-- Acompanhamento Mensal -->
      <div class="row q-col-gutter-md q-mt-md">
        <div class="col-12 col-md-6">
          <MonthlyStatsCard
            title="Este Mês"
            icon="calendar_today"
            :data="stats.currentMonth"
            :is-current-month="true"
          />
        </div>

        <div class="col-12 col-md-6">
          <MonthlyStatsCard title="Mês Anterior" icon="event" :data="stats.previousMonth" />
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { ReferralStats } from 'src/types/referral';
import { referralService } from 'src/services/referralService';
import { ref, onMounted } from 'vue';
import StatsCard from './components/StatsCard.vue';
import MonthlyStatsCard from './components/MonthlyStatsCard.vue';
import { useApiError } from 'src/composables/useApiError';

const { notifyError } = useApiError();
const isLoading = ref(false);

const stats = ref<ReferralStats>({
  total: 0,
  accepted: 0,
  declined: 0,
  pending: 0,
  currentMonth: {
    created: 0,
    responses: 0,
    accepted: 0,
    declined: 0,
  },
  previousMonth: {
    created: 0,
    responses: 0,
    accepted: 0,
    declined: 0,
  },
});

const loadStats = () => {
  isLoading.value = true;

  referralService
    .getStats()
    .then((data) => (stats.value = data))
    .catch(notifyError)
    .finally(() => (isLoading.value = false));
};

onMounted(() => {
  loadStats();
});
</script>
