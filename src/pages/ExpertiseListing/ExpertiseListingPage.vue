<template>
  <q-page class="q-pa-md">
    <div class="row items-start q-mb-md">
      <div class="col">
        <h4 class="text-h4 q-my-none q-mb-xs">
          <q-icon name="work" class="q-mr-sm gt-xs" />
          Áreas de Atuação
        </h4>
        <p
          class="text-grey-7 q-ma-none"
          :class="$q.screen.gt.sm ? 'text-subtitle1' : 'text-caption'"
        >
          Gerencie as áreas de atuação disponíveis
        </p>
      </div>
      <div class="col-auto">
        <q-btn
          color="primary"
          icon="add"
          :label="$q.screen.gt.xs ? 'Nova Área de Atuação' : ''"
          @click="showAddExpertise"
          unelevated
          :round="$q.screen.xs"
        >
          <q-tooltip v-if="$q.screen.xs">Nova Área de Atuação</q-tooltip>
        </q-btn>
      </div>
    </div>

    <ExpertiseList />
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import ExpertiseList from './components/ExpertiseList.vue';
import { PAGES } from 'src/constants/pages';
import { useAppRouter } from 'src/composables/useAppRouter';

const $q = useQuasar();
const { navigate } = useAppRouter();

const showAddExpertise = () => {
  navigate(PAGES.CREATE_EXPERTISE);
};
</script>

<style scoped>
.q-page {
  min-height: 70vh;
}
</style>
