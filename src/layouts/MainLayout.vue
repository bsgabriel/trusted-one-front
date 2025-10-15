<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />
        <q-toolbar-title> Agenda Profissional </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered class="bg-grey-1">
      <div class="q-pa-md">
        <div class="text-center q-mb-lg">
          <div class="text-h6 q-mt-sm">
            Olá, {{ currentUser?.name?.split(' ')[0] || 'Usuário' }}!
          </div>
          <div class="text-caption text-grey-6">
            {{ currentUser?.email || 'usuario@email.com' }}
          </div>
        </div>

        <q-separator class="q-mb-lg" />

        <q-list v-for="menu in menuOptions" :key="menu.id">
          <q-item
            clickable
            v-ripple
            @click="navigateToPage(menu.route)"
            :active="isMenuActive(menu.route)"
            active-class="menu-item-active"
          >
            <q-item-section avatar>
              <q-icon :name="menu.icon" />
            </q-item-section>
            <q-item-section>{{ menu.description }}</q-item-section>
          </q-item>
        </q-list>
      </div>

      <div class="absolute-bottom q-pa-md">
        <q-separator class="q-mb-md" />
        <q-item clickable v-ripple @click="handleLogout" :disable="isLoading" class="text-red-7">
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            <span v-if="!isLoading">Sair</span>
            <span v-else>Saindo...</span>
          </q-item-section>
          <q-item-section side v-if="isLoading">
            <q-spinner size="20px" />
          </q-item-section>
        </q-item>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useAuth } from '../composables/useAuth';
import { menuOptions } from '../types/menuOptions';
import { useRouter, useRoute } from 'vue-router';

const { currentUser, logout, isLoading } = useAuth();
const leftDrawerOpen = ref(false);
const router = useRouter();
const $route = useRoute();

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const handleLogout = async () => {
  await logout();
  void router.push('/login');
};

const navigateToPage = (route: string) => {
  void router.push(route);
  if (window.innerWidth < 1024) {
    leftDrawerOpen.value = false;
  }
};

const isMenuActive = (menuRoute: string) => {
  const currentPath = $route.path;

  if (menuRoute === '/') {
    return currentPath === '/';
  }

  return currentPath.startsWith(menuRoute);
};
</script>

<style scoped>
.absolute-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

:deep(.menu-item-active) {
  color: var(--q-primary) !important;
  border-right: 3px solid var(--q-primary);
  transform: translateX(4px);
  transition: transform 0.2s ease;
}
</style>
