<template>
  <q-card>
    <q-card-section>
      <q-expansion-item
        v-for="field in businessProfileFields"
        :key="field.key"
        :label="field.label"
        :caption="field.caption"
        header-class="bg-grey-2"
        class="q-mb-sm"
      >
        <q-card>
          <q-card-section>
            <q-input
              :model-value="modelValue[field.key]"
              @update:model-value="updateField(field.key, $event as string)"
              type="textarea"
              :label="field.label"
              outlined
              rows="4"
              autogrow
              :hint="field.hint"
            />
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { BusinessProfileForm } from '../types/formData';
import { BUSINESS_PROFILE_FIELDS } from '../constants/businessProfileFields'; 

interface Props {
  modelValue: BusinessProfileForm;
}

interface Emits {
  (e: 'update:modelValue', value: BusinessProfileForm): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const businessProfileFields = Object.values(BUSINESS_PROFILE_FIELDS);

const updateField = (key: keyof BusinessProfileForm, value: string) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [key]: value,
  });
};
</script>
