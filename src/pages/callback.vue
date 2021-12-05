<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
const params = route.fullPath.split("callback")[1]
// fetch(import.meta.env.VITE_SUPABASE_URL + "/auth/v1/callback" + params)
// fetch(import.meta.env.VITE_SUPABASE_URL + "/auth/v1/authorize?provider=twitter&redirect_to=http://localhost:3000")
fetch("/api/auth/verify" + params)
</script>

<template>
  <div>redirecting...</div>
</template>
