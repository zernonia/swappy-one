<script setup lang="ts">
import { store } from "@/scripts/store"
import { onBeforeMount, watch } from "vue"

watch(
  () => store.user,
  () => {
    window.open("./api/auth/sign_in", "_self")
  }
)
</script>

<template>
  <div class="text-white">redirecting...</div>
</template>
