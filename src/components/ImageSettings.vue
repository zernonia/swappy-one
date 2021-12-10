<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"

const { position, logo, size } = toRefs(store.templates)
</script>

<template>
  <div class="flex flex-col w-72">
    <label for="position">Position</label>
    <div>
      <input v-model="position.x" type="range" min="-200" max="50" />
      <input v-model="position.y" type="range" min="-150" max="50" />
    </div>
    <label for="position">Size</label>
    <div>
      <input v-model="size.scale" type="range" min="0" max="2" step="0.1" />
    </div>
  </div>
</template>
