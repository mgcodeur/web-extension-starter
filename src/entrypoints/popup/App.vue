<script setup lang="ts">
import ExtensionDetails from "@/domains/extension-info/components/ExtensionDetails.vue";
import ExtensionHeader from "@/domains/extension-info/components/ExtensionHeader.vue";
import ExtensionMenu from "@/domains/extension-info/components/ExtensionMenu.vue";
import { getExtensionInfo } from "@/domains/extension-info/services/extensionInfoService";

const extensionInfo = getExtensionInfo();
</script>

<template>
  <main class="w-72 bg-surface text-foreground">
    <ExtensionHeader :extension-name="extensionInfo.name" />
    <ExtensionDetails
      :version="extensionInfo.version"
      :browser-label="extensionInfo.browserLabel"
    />
    <ExtensionMenu />
  </main>
</template>
