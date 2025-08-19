<template>
  <q-btn
    :label="label"
    :loading="loading"
    :disable="disable"
    :color="color"
    :size="size"
    :type="type"
    :flat="flat"
    :outline="outline"
    :rounded="rounded"
    :no-caps="noCaps"
    :class="buttonClass"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <template v-if="$slots.default">
      <slot />
    </template>
  </q-btn>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  label?: string;
  loading?: boolean;
  disable?: boolean;
  color?: string;
  size?: string;
  type?: 'button' | 'submit' | 'reset';
  flat?: boolean;
  outline?: boolean;
  rounded?: boolean;
  noCaps?: boolean;
  fullWidth?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

// interface Emits {
//   click: [];
// }

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  disable: false,
  color: 'primary',
  type: 'button',
  noCaps: true,
  variant: 'primary',
});

// const emit = defineEmits<Emits>();

const buttonClass = computed(() => {
  const classes = [];

  if (props.fullWidth) {
    classes.push('full-width');
  }

  return classes.join(' ');
});
</script>

<style scoped>
.q-btn {
  min-height: 40px;
}
</style>
