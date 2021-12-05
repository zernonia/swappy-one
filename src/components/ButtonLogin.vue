<script setup lang="ts">
import { useRouter } from "vue-router"
import { supabase } from "../supabase"

const loginTwitter = async () => {
  window.open("./api/auth/sign_in", "_self")
  // const { data } = await supabase.auth.signIn({
  //   provider: "twitter",
  // })
}
</script>

<template>
  <button class="btn" @click="loginTwitter"><i-mdi:twitter class="mr-2"></i-mdi:twitter> Twitter</button>
</template>
