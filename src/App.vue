<template>
  <div class="flex flex-col min-h-screen font-Alegrya bg-app_third_color">
    <SiteNavigationVue />
    <RouterView />
  </div>
</template>

<script setup>
  import {RouterView} from 'vue-router';
  import SiteNavigationVue from './components/SiteNavigation.vue';

</script>

<style lang="scss" scoped>

</style>