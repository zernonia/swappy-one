<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"

const { position, logo, jsDelivrLogo, size, name } = toRefs(store.templates)
</script>

<template>
  <div class="flex flex-col w-72">
    <!-- <label for="position">Position</label>
    <div>
      <input type="number" v-model="position.x" />
      <input type="number" v-model="position.y" />
    </div> -->
    <label for="position">Size</label>
    <div>
      <input v-model="size.scale" type="range" min="0" max="2" step="0.1" />
    </div>
  </div>
</template>
