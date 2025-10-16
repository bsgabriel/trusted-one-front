<template>
  <q-card>
    <q-card-section>
      <div v-if="contactMethods.length === 0" class="text-center q-py-md text-grey-6">
        <q-icon name="phone_disabled" size="3rem" color="grey-4" />
        <div class="q-mt-sm">Nenhum meio de contato adicionado</div>
        <div class="text-caption">Adicione pelo menos um meio de contato</div>
      </div>

      <div v-else class="q-gutter-md">
        <q-card
          v-for="(contact, index) in contactMethods"
          :key="contact.contactMethodId || `new-${index}`"
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
                lazy-rules
              >
                <template v-slot:prepend>
                  <q-icon :name="getContactIcon(contact.type as ContactMethodType)" />
                </template>
              </q-select>
            </div>

            <div class="col-12 col-md-6">
              <q-input
                v-model="contact.info"
                :label="getContactLabel(contact.type as ContactMethodType)"
                outlined
                dense
                :rules="[
                  (val) => !!val || 'Valor é obrigatório',
                  (val) =>
                    validateContactValue(contact.type as ContactMethodType, val) ||
                    'Formato inválido',
                ]"
                lazy-rules
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
import type { ContactMethodType } from 'src/types/contactMethod';
import { contactTypeConfigs, DEFAULT_CONTACT_CONFIG } from '../constants/contactMethodFields';
import type { ContactMethodForm } from '../types/formData';
import { computed } from 'vue';

interface Props {
  modelValue: ContactMethodForm[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:modelValue': [value: ContactMethodForm[]];
}>();

const contactMethods = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const contactTypeOptions = Object.values(contactTypeConfigs);

const addContactMethod = () => {
  contactMethods.value.push({ type: '', info: '' });
};

const removeContactMethod = (index: number) => {
  const filtered = contactMethods.value.filter((_, i) => i !== index);

  if (filtered.length === 0) {
    contactMethods.value = [{ type: '', info: '' }];
  } else {
    contactMethods.value = filtered;
  }
};

const getContactIcon = (type: ContactMethodType): string => {
  return contactTypeConfigs[type]?.icon ?? DEFAULT_CONTACT_CONFIG.icon;
};

const getContactLabel = (type: ContactMethodType): string => {
  return contactTypeConfigs[type]?.inputLabel ?? DEFAULT_CONTACT_CONFIG.inputLabel;
};

const validateContactValue = (type: ContactMethodType, value: string): boolean => {
  if (!value) {
    return false;
  }
  return contactTypeConfigs[type]?.validate(value) ?? DEFAULT_CONTACT_CONFIG.validate(value);
};
</script>

<style scoped>
.border-negative {
  border: 2px solid var(--q-negative);
}
</style>
