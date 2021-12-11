<script setup lang="ts">
import { supabase } from "@/supabase"

const logout = async () => {
  const { error } = await supabase.auth.signOut()
  console.log(error)
}
</script>

<template>
  <div>
    <button @click="logout" class="rounded-full bg-dark-500 !p-0 !w-9 !h-9 btn shadow-md">
      <i-uim:signout class="text-green-400"></i-uim:signout>
    </button>
  </div>
</template>
