<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <!-- pesquisa/quantiadede de itens -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-8">
          <q-input
            :model-value="searchQuery"
            @update:model-value="updateSearchQuery"
            outlined
            dense
            :placeholder="searchPlaceholder"
          >
            <template v-slot:prepend>
              <q-icon name="search" />
            </template>
            <template v-slot:append>
              <q-icon
                v-if="searchQuery"
                name="close"
                class="cursor-pointer"
                @click="$emit('clear-search')"
              />
            </template>
          </q-input>
        </div>
        <div class="col-12 col-md-4">
          <q-select
            :model-value="pageSize"
            @update:model-value="$emit('update:pageSize', $event)"
            :options="pageSizeOptions"
            outlined
            dense
            label="Itens por página"
          />
        </div>
      </div>

      <!-- cabecalho -->
      <div class="row items-center justify-between q-mt-md">
        <div class="col">
          <div class="text-h6">{{ title }}</div>
          <div class="text-caption text-grey-6">
            {{ paginationInfo }}
          </div>
        </div>
      </div>
    </q-card-section>

    <q-separator class="q-mt-md" />

    <!-- carregamento -->
    <q-card-section v-if="loading && items.length === 0">
      <div class="text-center q-py-lg">
        <q-spinner color="primary" size="3rem" />
        <div class="text-body1 text-grey-6 q-mt-md">{{ loadingText }}</div>
      </div>
    </q-card-section>

    <!-- mensagem de erro -->
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

    <!-- lista vazia -->
    <q-card-section v-else-if="items.length === 0">
      <div class="text-center q-py-lg">
        <q-icon :name="emptyIcon" size="4rem" color="grey-5" />
        <div class="text-h6 q-mt-md text-grey-6">
          {{ searchQuery ? emptySearchText : emptyText }}
        </div>
        <div class="text-body2 text-grey-5 q-mt-sm">
          {{ searchQuery ? emptySearchHint : emptyHint }}
        </div>
      </div>
    </q-card-section>

    <!-- conteúdo -->
    <div v-else>
      <q-list separator>
        <slot name="item" v-for="item in items" :item="item" :key="getItemKey(item)" />
      </q-list>

      <!-- paginação -->
      <q-card-section class="q-pt-md">
        <div class="row justify-center">
          <q-pagination
            :model-value="currentPage"
            @update:model-value="$emit('update:currentPage', $event)"
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
  searchQuery: string;
  title?: string;
  searchPlaceholder?: string;
  loadingText?: string;
  errorTitle?: string;
  emptyIcon?: string;
  emptyText?: string;
  emptyHint?: string;
  emptySearchText?: string;
  emptySearchHint?: string;
  pageSizeOptions?: number[];
  itemKey?: string;
  entityName?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Lista',
  searchPlaceholder: 'Buscar...',
  loadingText: 'Carregando...',
  errorTitle: 'Erro ao carregar',
  emptyIcon: 'inbox',
  emptyText: 'Nenhum item encontrado',
  emptyHint: 'Adicione novos itens para começar',
  emptySearchText: 'Nenhum resultado encontrado',
  emptySearchHint: 'Tente buscar com outros termos',
  pageSizeOptions: () => [10, 20, 50, 100],
  itemKey: 'id',
  entityName: 'item',
});

const emit = defineEmits<{
  'update:searchQuery': [value: string | number | null];
  'update:pageSize': [value: number];
  'update:currentPage': [value: number];
  'clear-search': [];
  retry: [];
}>();

const updateSearchQuery = (value: string | number | null) => {
  emit('update:searchQuery', value);
};

const paginationInfo = computed(() => {
  if (props.totalElements === 0) return `0 ${props.entityName}s`;

  const start = (props.currentPage - 1) * props.pageSize + 1;
  const end = Math.min(props.currentPage * props.pageSize, props.totalElements);

  return `Mostrando ${start}-${end} de ${props.totalElements} ${props.entityName}${props.totalElements !== 1 ? 's' : ''}`;
});

const getItemKey = (item: T): string | number => {
  return item[props.itemKey] as string | number;
};
</script>
