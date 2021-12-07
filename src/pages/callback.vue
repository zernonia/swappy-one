<script setup lang="ts">
import { store } from "@/scripts/store"
import { routerKey, useRoute, useRouter } from "vue-router"

const route = useRoute()
const router = useRouter()
const params = route.fullPath.split("callback")[1]

fetch("/api/auth/verify" + params + "&user_id=" + store.user?.id)
  .then((res) => res.json())
  .then((res) => {
    router.push("/")
  })
</script>

<template>
  <div>redirecting...</div>
</template>
