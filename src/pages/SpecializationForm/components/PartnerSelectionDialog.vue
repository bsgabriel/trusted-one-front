<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)">
    <q-card style="min-width: 500px; max-width: 600px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Associar Parceiros</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <!-- Campo de Busca -->
        <q-select
          v-model="searchedPartner"
          label="Buscar Parceiro"
          outlined
          use-input
          :options="partnerOptions"
          option-label="name"
          option-value="partnerId"
          @filter="filterPartners"
          hint="Digite para buscar"
          clearable
          :loading="isLoading"
          @update:model-value="addPartnerToSelection"
        >
          <template v-slot:no-option>
            <q-item>
              <q-item-section class="text-grey">Digite para buscar</q-item-section>
            </q-item>
          </template>
        </q-select>

        <!-- Lista de Parceiros Selecionados -->
        <div v-if="selectedPartners.length > 0" class="q-mt-md">
          <div class="text-subtitle2 text-grey-7 q-mb-sm">
            {{ selectedPartners.length }} parceiro{{
              selectedPartners.length === 1 ? '' : 's'
            }}
            selecionado{{ selectedPartners.length === 1 ? '' : 's' }}
          </div>

          <q-list bordered separator>
            <q-item v-for="partner in selectedPartners" :key="partner.partnerId">
              <q-item-section avatar>
                <q-avatar color="primary" text-color="white" size="40px">
                  {{ getInitials(partner.name) }}
                </q-avatar>
              </q-item-section>

              <q-item-section>
                <q-item-label>{{ partner.name }}</q-item-label>
              </q-item-section>

              <q-item-section side>
                <q-btn
                  icon="close"
                  flat
                  round
                  dense
                  @click="removeFromSelection(partner.partnerId)"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </div>

        <div v-else class="text-center text-grey-7 q-mt-md q-pa-md">
          Busque e selecione parceiros para adicionar ao grupo
        </div>
      </q-card-section>

      <q-card-actions align="right" class="q-px-md q-pb-md">
        <q-btn label="Cancelar" color="grey-7" flat v-close-popup />
        <q-btn
          label="Adicionar"
          color="primary"
          unelevated
          :disable="selectedPartners.length === 0"
          @click="confirmSelection"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import type { PartnerListing } from 'src/types/partner';
import { ref, computed, watch } from 'vue';
import { partnerService } from 'src/services/partnerService';
import { useApiError } from 'src/composables/useApiError';

interface Props {
  modelValue: boolean;
  excludePartnerIds?: number[];
}

const props = withDefaults(defineProps<Props>(), {
  excludePartnerIds: () => [],
});

const emit = defineEmits<{
  'update:modelValue': [value: boolean];
  confirm: [partners: PartnerListing[]];
}>();

const { notifyError } = useApiError();
const partnerOptions = ref<PartnerListing[]>([]);
const selectedPartners = ref<PartnerListing[]>([]);
const searchedPartner = ref<PartnerListing>();
const isLoading = ref(false);

const selectedPartnerIds = computed(() => {
  return selectedPartners.value.map((p) => p.partnerId);
});

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((word) => word.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();
};

const filterPartners = (val: string, update: (fn: () => void) => void) => {
  update(() => {
    isLoading.value = true;
    partnerService
      .listPartners({
        page: 0,
        size: 30,
        search: val,
        fullSearch: false,
      })
      .then((result) => {
        partnerOptions.value = result.content.filter(
          (partner) =>
            !props.excludePartnerIds.includes(partner.partnerId) &&
            !selectedPartnerIds.value.includes(partner.partnerId),
        );
      })
      .catch(notifyError)
      .finally(() => (isLoading.value = false));
  });
};

const addPartnerToSelection = (partner: PartnerListing | null) => {
  if (!partner) {
    return;
  }

  const alreadySelected = selectedPartnerIds.value.includes(partner.partnerId);

  if (!alreadySelected) {
    selectedPartners.value.push(partner);
  }

  searchedPartner.value = undefined;
};

const removeFromSelection = (partnerId: number) => {
  selectedPartners.value = selectedPartners.value.filter((p) => p.partnerId !== partnerId);
};

const confirmSelection = () => {
  emit('confirm', [...selectedPartners.value]);
  selectedPartners.value = [];
  emit('update:modelValue', false);
};

watch(
  () => props.modelValue,
  (isOpen) => {
    if (!isOpen) {
      selectedPartners.value = [];
      searchedPartner.value = undefined;
      partnerOptions.value = [];
    }
  },
);
</script>
