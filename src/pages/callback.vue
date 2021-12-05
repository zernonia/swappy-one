<script setup lang="ts">
import { useRoute } from "vue-router"

const route = useRoute()
const params = route.fullPath.split("callback")[1]
// fetch(import.meta.env.VITE_SUPABASE_URL + "/auth/v1/callback" + params)
// window.open(import.meta.env.VITE_SUPABASE_URL + "/auth/v1/callback" + params, "_self")
// fetch(import.meta.env.VITE_SUPABASE_URL + "/auth/v1/authorize?provider=twitter").then((res) => console.log(res))
fetch("/api/auth/verify" + params)
  .then((res) => res.json())
  .then((res) => {
    window.open(
      import.meta.env.VITE_SUPABASE_URL + "/auth/v1/authorize?provider=twitter&redirect_to=http://localhost:3000",
      "_self"
    )
  })
</script>

<template>
  <div>redirecting...</div>
</template>
