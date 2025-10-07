<template>
  <q-card :class="{ 'border-negative': hasError }">
    <q-card-section>
      <div v-if="contactMethods.length === 0" class="text-center q-py-md text-grey-6">
        <q-icon name="phone_disabled" size="3rem" color="grey-4" />
        <div class="q-mt-sm">Nenhum meio de contato adicionado</div>
        <div class="text-caption">Adicione pelo menos um meio de contato</div>
      </div>

      <div v-else class="q-gutter-md">
        <q-card
          v-for="(contact, index) in contactMethods"
          :key="index"
          flat
          bordered
          class="q-pa-md"
        >
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-4">
              <q-select
                v-model="contact.type"
                label="Tipo *"
                outlined
                dense
                :options="contactTypeOptions"
                option-label="label"
                option-value="value"
                emit-value
                map-options
                :rules="[(val) => !!val || 'Tipo é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon :name="getContactIcon(contact.type)" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-7">
              <q-input
                v-model="contact.value"
                :label="getContactLabel(contact.type)"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Valor é obrigatório',
                  (val) => validateContactValue(contact.type, val) || 'Formato inválido',
                ]"
              />
            </div>

            <div class="col-12 col-md-1">
              <q-btn
                icon="delete"
                color="negative"
                flat
                size="md"
                @click="removeContactMethod(index)"
              >
                <q-tooltip>Remover</q-tooltip>
              </q-btn>
            </div>
          </div>
        </q-card>
      </div>
      <div class="q-mt-lg flex justify-end">
        <q-btn
          icon="add"
          color="primary"
          label="Adicionar"
          size="md"
          @click="addContactMethod"
          unelevated
        />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { ContactMethod } from 'src/types/partner';
import { computed } from 'vue';

interface Props {
  modelValue: ContactMethod[];
  hasError?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasError: false,
});

const emit = defineEmits<{
  'update:modelValue': [value: ContactMethod[]];
}>();

const contactMethods = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const contactTypeOptions = [
  { value: 'email', label: 'E-mail' },
  { value: 'phone', label: 'Telefone' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'website', label: 'Website' },
  { value: 'other', label: 'Outro' },
];

const addContactMethod = () => {
  contactMethods.value = [...contactMethods.value, { type: '', value: '' }];
};

const removeContactMethod = (index: number) => {
  contactMethods.value = contactMethods.value.filter((_, i) => i !== index);
};

const getContactIcon = (type: string): string => {
  const icons: Record<string, string> = {
    email: 'email',
    phone: 'phone',
    whatsapp: 'chat',
    linkedin: 'work',
    instagram: 'photo_camera',
    website: 'language',
    other: 'contact_page',
  };
  return icons[type] || 'contact_page';
};

const getContactLabel = (type: string): string => {
  const labels: Record<string, string> = {
    email: 'E-mail *',
    phone: 'Telefone *',
    whatsapp: 'WhatsApp *',
    linkedin: 'URL do LinkedIn *',
    instagram: 'Handle do Instagram *',
    website: 'URL do Website *',
    other: 'Valor *',
  };
  return labels[type] || 'Valor *';
};

const validateContactValue = (type: string, value: string): boolean => {
  if (!value) return false;

  switch (type) {
    case 'email':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    case 'phone':
    case 'whatsapp':
      return /^\+?[\d\s()-]{8,}$/.test(value);
    case 'linkedin':
    case 'website':
      return /^https?:\/\/.+/.test(value) || /^www\..+/.test(value);
    case 'instagram':
      return /^@?[\w.]+$/.test(value);
    default:
      return value.length > 0;
  }
};
</script>

<style scoped>
.border-negative {
  border: 2px solid var(--q-negative);
}
</style>
