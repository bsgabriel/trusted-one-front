<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="domain" class="q-mr-sm gt-xs" />
          Empresas
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          Gerencie suas empresas cadastradas
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          :label="$q.screen.gt.xs ? 'Nova Empresa' : ''"
          @click="showAddCompany"
          unelevated
          :round="$q.screen.xs"
        >
          <q-tooltip v-if="$q.screen.xs">Nova Empresa</q-tooltip>
        </q-btn>
      </div>
    </div>

    <CompanyList />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import CompanyList from './components/CompanyList.vue';
import { useAppRouter } from 'src/composables/useAppRouter';
import { PAGES } from 'src/constants/pages';

const $q = useQuasar();
const { navigate } = useAppRouter();

const showAddCompany = () => {
  navigate(PAGES.CREATE_COMPANY);
};
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}
</style>
