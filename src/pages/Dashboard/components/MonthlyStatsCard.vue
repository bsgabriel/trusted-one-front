<template>
  <q-card>
    <q-card-section>
      <div class="text-h6 q-mb-md">
        <q-icon :name="icon" class="q-mr-sm" />
        {{ title }}
      </div>

      <div class="q-mb-md">
        <div class="text-caption text-grey-7 q-mb-xs">Indicações Criadas</div>
        <div class="row items-center">
          <q-icon
            name="add_circle"
            :color="isCurrentMonth ? 'primary' : 'grey-6'"
            size="20px"
            class="q-mr-sm"
          />
          <span
            class="text-h5 text-weight-bold"
            :class="isCurrentMonth ? 'text-primary' : 'text-grey-7'"
          >
            {{ data.created }}
          </span>
        </div>
      </div>

      <q-separator class="q-my-md" />

      <div>
        <div class="text-caption text-grey-7 q-mb-sm">Respostas Recebidas</div>
        <div class="row items-center q-mb-sm">
          <q-icon
            name="feedback"
            :color="isCurrentMonth ? 'grey-7' : 'grey-6'"
            size="20px"
            class="q-mr-sm"
          />
          <span
            class="text-h6 text-weight-medium"
            :class="isCurrentMonth ? 'text-grey-8' : 'text-grey-7'"
          >
            {{ data.responses }} respostas
          </span>
        </div>

        <div class="q-ml-lg">
          <div class="row items-center q-mb-xs">
            <q-icon
              name="check_circle"
              :color="isCurrentMonth ? 'positive' : 'grey-6'"
              size="18px"
              class="q-mr-xs"
            />
            <span class="text-body2" :class="isCurrentMonth ? '' : 'text-grey-7'">
              <strong>{{ data.accepted }}</strong> aceitas
            </span>
          </div>
          <div class="row items-center">
            <q-icon
              name="cancel"
              :color="isCurrentMonth ? 'negative' : 'grey-6'"
              size="18px"
              class="q-mr-xs"
            />
            <span class="text-body2" :class="isCurrentMonth ? '' : 'text-grey-7'">
              <strong>{{ data.declined }}</strong> recusadas
            </span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
interface MonthlyData {
  created: number;
  responses: number;
  accepted: number;
  declined: number;
}

interface Props {
  title: string;
  icon: string;
  data: MonthlyData;
  isCurrentMonth?: boolean;
}

withDefaults(defineProps<Props>(), {
  isCurrentMonth: false,
});
</script>
