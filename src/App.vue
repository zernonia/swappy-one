<script setup lang="ts">
import { supabase } from "@/supabase"
import { onMounted } from "vue-demi"
import { store } from "./scripts/store"

supabase.auth.onAuthStateChange(async (ev, session) => {
  if (ev == "SIGNED_IN" && session) {
    store.user = session.user
    if (store.user?.id) {
      const { data } = await supabase.from("user_token").select("*").eq("user_id", store.user.id).single()
      store.provider_token.token = data.oauth_token
      store.provider_token.secret = data.oauth_token_secret
    }
  }
})
</script>

<template>
  <div class="w-screen h-screen p-8">
    <h1 class="text-3xl font-bold">Twitter Temporary Profile</h1>

    <router-view></router-view>
  </div>
</template>
