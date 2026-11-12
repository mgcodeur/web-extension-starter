<script setup lang="ts">
defineProps<{
  version: string;
  browserLabel: string;
}>();
</script>

<template>
  <dl class="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1 px-4 pb-4 text-sm">
    <dt>Version</dt>
    <dd class="text-right tabular-nums">{{ version }}</dd>
    <dt>Navigateur</dt>
    <dd class="text-right">{{ browserLabel }}</dd>
  </dl>
</template>
