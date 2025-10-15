<template>
  <q-card>
    <q-card-section>
      <q-expansion-item
        v-for="field in businessProfileFields"
        :key="field.category"
        :label="field.label"
        :caption="field.caption"
        header-class="bg-grey-2"
        class="q-mb-sm"
      >
        <q-card>
          <q-card-section>
            <div
              v-for="(item, index) in getItemsByCategory(field.category)"
              :key="item.businessProfileId || `new-${index}`"
              class="q-mb-md"
            >
              <div class="row items-center q-col-gutter-sm">
                <div class="col">
                  <q-input
                    :model-value="item.info"
                    @update:model-value="updateItem(item, $event as string)"
                    type="textarea"
                    :label="`${field.fieldCaption} #${index + 1}`"
                    outlined
                    rows="3"
                    autogrow
                  />
                </div>
                <div class="col-auto col-md-1">
                  <q-btn icon="delete" color="negative" flat size="md" @click="removeItem(item)" />
                </div>
              </div>
            </div>

            <div class="flex justify-end">
              <q-btn
                flat
                color="primary"
                icon="add"
                :label="`Adicionar ${field.fieldCaption}`"
                @click="addItem(field.category)"
                class="q-mt-sm"
              />
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import type { BusinessProfileForm } from '../types/formData';
import { BUSINESS_PROFILE_FIELDS } from '../constants/businessProfileFields';
import type { BusinessProfileCategory } from 'src/types/partner';

interface Props {
  modelValue: BusinessProfileForm[];
}

interface Emits {
  (e: 'update:modelValue', value: BusinessProfileForm[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();
const businessProfileFields = Object.values(BUSINESS_PROFILE_FIELDS);

const getItemsByCategory = (category: BusinessProfileCategory): BusinessProfileForm[] => {
  return props.modelValue.filter((item) => item.category === category);
};

const addItem = (category: BusinessProfileCategory) => {
  const newItem: BusinessProfileForm = {
    category,
    info: '',
  };

  emit('update:modelValue', [...props.modelValue, newItem]);
};

const removeItem = (itemToRemove: BusinessProfileForm) => {
  const updatedArray = props.modelValue.filter((item) => item !== itemToRemove);
  emit('update:modelValue', updatedArray);
};

const updateItem = (itemToUpdate: BusinessProfileForm, info: string) => {
  const updatedArray = props.modelValue.map((item) =>
    item === itemToUpdate ? { ...item, info } : item,
  );

  emit('update:modelValue', updatedArray);
};
</script>
