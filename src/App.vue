<script setup lang="ts">
import { supabase } from "@/supabase"
import { onMounted } from "vue-demi"
import { store } from "./scripts/store"

supabase.auth.onAuthStateChange((ev, session) => {
  if (ev == "SIGNED_IN" && session) {
    store.user = session.user
    store.provider_token = session.provider_token
    console.log(session)
  }
})
</script>

<template>
  <div class="w-screen h-screen">
    <h1 class="text-2xl font-bold">Twitter Gamify</h1>

    <router-view></router-view>
  </div>
</template>
