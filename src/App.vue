<script setup lang="ts">
import { supabase } from "@/supabase"
import { onMounted } from "vue-demi"
import TermsPrivacy from "./components/TermsPrivacy.vue"
import { store } from "./scripts/store"

supabase.auth.onAuthStateChange(async (ev, session) => {
  if (ev == "SIGNED_IN" && session) {
    store.user = session.user
    if (store.user?.id) {
      const { data } = await supabase.from("user_token").select("*").eq("user_id", store.user.id).single()
      store.provider_token.token = data.oauth_token
      store.provider_token.secret = data.oauth_token_secret
    }
  } else if (ev == "SIGNED_OUT") {
    store.user = null
  }
})
</script>

<template>
  <div class="w-screen min-h-screen p-4 py-8 sm:p-8 bg-dark-900 flex flex-col justify-center items-center md:pb-32">
    <router-link to="/">
      <h1 class="text-4xl text-center font-bold text-white inline-flex mb-4 text-shadow-green">
        Swappy
        <span class="text-green-500">.</span>
        <span class="text-green-300"> one</span>
      </h1>
    </router-link>

    <router-view></router-view>

    <footer v-if="$route.path == '/'" class="mt-8">
      <TermsPrivacy></TermsPrivacy>
      <p class="text-white text-xs mt-1">
        Made by <a href="https://zernonia.com" target="_blank">Zernonia</a>
        <span class="mx-1">|</span>

        <a href="https://github.com/zernonia" target="_blank" rel="noopener">Github</a>,
        <a href="https://twitter.com/zernonia" target="_blank" rel="noopener">Twitter</a>
      </p>
    </footer>
  </div>
</template>
