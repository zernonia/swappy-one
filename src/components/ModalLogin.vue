<script setup lang="ts">
import { onMounted, onUnmounted } from "vue"
import { store } from "@/scripts/store"
import { supabase } from "../supabase"

const loginTwitter = async () => {
  const { user, session, error } = await supabase.auth.signIn({
    provider: "twitter",
  })
}
</script>

<template>
  <section
    class="
      fixed
      top-0
      left-0
      w-screen
      h-screen
      bg-dark-100 bg-opacity-20
      backdrop-filter backdrop-blur
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      class="w-auto h-auto flex flex-col items-center justify-center bg-dark-800 p-8 rounded-lg text-white space-y-4"
    >
      <button
        class="
          w-64
          p-2
          rounded-lg
          bg-blue-500
          inline-flex
          items-center
          justify-center
          focus:outline-none focus:ring focus:ring-blue-400
        "
        @click="loginTwitter"
      >
        <i-mdi:twitter class="mr-2"></i-mdi:twitter> Twitter
      </button>
    </div>
  </section>
</template>
