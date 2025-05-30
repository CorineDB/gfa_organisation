<script setup>
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

const route = useRoute();
const router = useRouter();

const breadcrumbs = computed(() => {
  const matchedRoutes = route.matched;
  return matchedRoutes.map(r => ({
    title: r.name,
    path: r.path
  }));
});
</script>

<template>
  <nav   aria-label="breadcrumb" class="hidden mr-auto -intro-x sm:flex">
    <ul class="breadcrumb">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <router-link v-if="index !== breadcrumbs.length - 1" :to="crumb.path" class="breadcrumb-item active">
          {{ crumb.title }}
        </router-link>
        <span v-else class="breadcrumb-item">{{ crumb.title }}</span>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
/* .breadcrumb {
  list-style: none;
  display: flex;
  gap: 8px;
}
.breadcrumb li:not(:last-child)::after {
  content: ">";
  margin-left: 8px;
} */
</style>
