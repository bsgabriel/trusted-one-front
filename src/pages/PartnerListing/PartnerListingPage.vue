<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="people" class="q-mr-sm gt-xs" />
          Parceiros
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
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

    <PartnerList />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import PartnerList from './components/PartnerList.vue';
import { useAppRouter } from 'src/composables/useAppRouter';
import { PAGES } from 'src/constants/pages';

const $q = useQuasar();
const { navigate } = useAppRouter();

const showAddPartner = () => {
  navigate(PAGES.CREATE_PARTNER);
};
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}
</style>
