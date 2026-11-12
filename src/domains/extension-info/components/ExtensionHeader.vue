<script setup lang="ts">
defineProps<{
  extensionName: string;
}>();
</script>

<template>
  <header class="flex items-center gap-3 p-4">
    <img
      src="../assets/logo.svg"
      alt=""
      width="32"
      height="32"
      class="size-8"
    />
    <h1 class="text-sm font-semibold">{{ extensionName }}</h1>
  </header>
</template>
