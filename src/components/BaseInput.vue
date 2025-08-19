<template>
  <div class="base-input">
    <q-input
      v-model="inputValue"
      :label="label"
      :type="type"
      :error="hasError"
      :error-message="errorMessage"
      :loading="loading"
      :disable="disable"
      :placeholder="placeholder"
      :rules="validationRules"
      filled
      v-bind="$attrs"
      @blur="$emit('blur')"
      @focus="$emit('focus')"
    >
      <template v-if="$slots.prepend" #prepend>
        <slot name="prepend" />
      </template>
      <template v-if="$slots.append" #append>
        <slot name="append" />
      </template>
    </q-input>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  modelValue: string;
  label?: string;
  type?:
    | 'text'
    | 'password'
    | 'textarea'
    | 'email'
    | 'search'
    | 'tel'
    | 'file'
    | 'number'
    | 'url'
    | 'time'
    | 'date'
    | 'datetime-local'
    | undefined;
  placeholder?: string;
  error?: string | boolean;
  loading?: boolean;
  disable?: boolean;
  rules?: Array<(val: string) => boolean | string>;
}

interface Emits {
  'update:modelValue': [value: string];
  blur: [];
  focus: [];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  error: false,
  loading: false,
  disable: false,
});

const emit = defineEmits<Emits>();

const inputValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const hasError = computed(() => {
  return typeof props.error === 'string' ? props.error.length > 0 : props.error;
});

const errorMessage = computed(() => {
  return typeof props.error === 'string' ? props.error : undefined;
});

const validationRules = computed(() => {
  return props.rules || [];
});
</script>

<style scoped>
.base-input {
  margin-bottom: 16px;
}
</style>
