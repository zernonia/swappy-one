<script setup lang="ts">
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const loginTwitter = async () => {
  await supabase.auth.signIn(
    {
      provider: "twitter",
    },
    { redirectTo: window.location.href + "/callback-redirect" }
  )
}
</script>

<template>
  <button class="btn" @click="loginTwitter"><i-mdi:twitter class="mr-2"></i-mdi:twitter> Twitter</button>
</template>
