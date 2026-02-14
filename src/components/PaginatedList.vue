<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <!-- Filtros -->
      <div v-if="$slots.filters" class="row q-col-gutter-md q-mb-md">
        <slot name="filters"></slot>
      </div>

      <div class="row items-center justify-between">
        <div class="col">
          <div class="text-h6">{{ title }}</div>
          <div class="text-caption text-grey-6">{{ paginationInfo }}</div>
        </div>
        <div class="col-auto">
          <q-select
            :model-value="pageSize"
            @update:model-value="handlePageSizeChange"
            :options="pageSizeOptions"
            outlined
            dense
            label="Itens por página"
            style="min-width: 160px"
          />
        </div>
      </div>
    </q-card-section>

    <q-separator class="q-mt-md" />

    <!-- Estado: Carregando -->
    <q-card-section v-if="loading && items.length === 0">
      <div class="text-center q-py-lg">
        <q-spinner color="primary" size="3rem" />
        <div class="text-body1 text-grey-6 q-mt-md">{{ loadingText }}</div>
      </div>
    </q-card-section>

    <!-- Estado: Erro -->
    <q-card-section v-else-if="error">
      <div class="text-center q-py-lg">
        <q-icon name="error_outline" size="4rem" color="negative" />
        <div class="text-h6 q-mt-md text-negative">{{ errorTitle }}</div>
        <div class="text-body2 text-grey-6 q-mt-sm">{{ error }}</div>
        <q-btn
          color="primary"
          label="Tentar novamente"
          @click="$emit('retry')"
          class="q-mt-md"
          outline
        />
      </div>
    </q-card-section>

    <!-- Estado: Lista vazia -->
    <q-card-section v-else-if="items.length === 0">
      <div class="text-center q-py-lg">
        <q-icon name="inbox" size="4rem" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-6">{{ emptyText }}</div>
        <div class="text-body2 text-grey-5 q-mt-sm">{{ emptyHint }}</div>
      </div>
    </q-card-section>

    <!-- Lista de itens -->
    <div v-else>
      <q-list separator>
        <slot name="item" v-for="item in items" :item="item" :key="getItemKey(item)" />
      </q-list>

      <!-- Paginação -->
      <q-card-section class="q-pt-md">
        <div class="row justify-center">
          <q-pagination
            :model-value="currentPage"
            @update:model-value="handlePageChange"
            :max="totalPages"
            :max-pages="5"
            direction-links
            boundary-links
            :disable="loading"
          />
        </div>
      </q-card-section>
    </div>
  </q-card>
</template>

<script setup lang="ts" generic="T extends Record<string, any>">
import { computed } from 'vue';

interface Props {
  items: T[];
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalElements: number;
  title?: string;
  loadingText?: string;
  errorTitle?: string;
  emptyText?: string;
  emptyHint?: string;
  pageSizeOptions?: number[];
  itemKey?: string;
  entityName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Lista',
  loadingText: 'Carregando...',
  errorTitle: 'Erro ao carregar',
  emptyIcon: 'inbox',
  emptyText: 'Nenhum item encontrado',
  emptyHint: 'Adicione novos itens para começar',
  pageSizeOptions: () => [10, 20, 50, 100],
  itemKey: 'id',
  entityName: 'item',
});

const emit = defineEmits<{
  'update:pageSize': [value: number];
  'update:currentPage': [value: number];
  pageSizeChange: [];
  pageChange: [];
  retry: [];
}>();

const paginationInfo = computed(() => {
  if (props.totalElements === 0) return `0 ${props.entityName}s`;

  const start = (props.currentPage - 1) * props.pageSize + 1;
  const end = Math.min(props.currentPage * props.pageSize, props.totalElements);

  return `Mostrando ${start}-${end} de ${props.totalElements} ${props.entityName}${props.totalElements !== 1 ? 's' : ''}`;
});

const getItemKey = (item: T): string | number => {
  return item[props.itemKey] as string | number;
};

const handlePageSizeChange = (newSize: number) => {
  emit('update:pageSize', newSize);
  emit('update:currentPage', 1);
  emit('pageSizeChange');
};

const handlePageChange = (newPage: number) => {
  emit('update:currentPage', newPage);
  emit('pageChange');
};
</script>
