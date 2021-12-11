<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"

const { position, logo, size } = toRefs(store.templates)
</script>

<template>
  <div class="flex flex-col mt-2">
    <label for="position">Position (x, y)</label>
    <div>
      <input class="w-full" v-model="position.x" type="range" min="-50" max="250" />
      <input class="w-full" v-model="position.y" type="range" min="-50" max="250" />
    </div>
    <label for="position">Size</label>
    <div>
      <input class="w-full" v-model="size.scale" type="range" min="0" max="2" step="0.1" />
    </div>
  </div>
</template>
