<template>
  <q-card>
    <q-card-section>
      <q-expansion-item
        v-for="field in GAIN_PROFILE_FIELDS"
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
              :key="item.gainsProfileId || `new-${index}`"
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
                  <q-btn
                    icon="delete"
                    color="negative"
                    flat
                    size="md"
                    @click="removeItem(item)"
                  />
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
import type { GainsCategory } from 'src/types/partner';
import type { GainsProfileForm } from '../types/formData';
import { GAIN_PROFILE_FIELDS } from '../constants/gainsProfileFields';

interface Props {
  modelValue: GainsProfileForm[];
}

interface Emits {
  (e: 'update:modelValue', value: GainsProfileForm[]): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const getItemsByCategory = (category: GainsCategory): GainsProfileForm[] => {
  return props.modelValue.filter((item) => item.category === category);
};

const addItem = (category: GainsCategory) => {
  const newItem: GainsProfileForm = {
    category,
    info: '',
  };

  emit('update:modelValue', [...props.modelValue, newItem]);
};

const removeItem = (itemToRemove: GainsProfileForm) => {
  const updatedArray = props.modelValue.filter((item) => item !== itemToRemove);
  emit('update:modelValue', updatedArray);
};

const updateItem = (itemToUpdate: GainsProfileForm, info: string) => {
  const updatedArray = props.modelValue.map((item) =>
    item === itemToUpdate ? { ...item, info } : item,
  );

  emit('update:modelValue', updatedArray);
};
</script>
