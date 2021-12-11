<script setup lang="ts">
import { computed } from "vue"
import Modal from "./Modal.vue"

const props = defineProps({
  currentStep: {
    type: Number,
    default: 2,
  },
  totalStep: {
    type: Number,
    default: 5,
  },
  text: String,
})

const emits = defineEmits(["close"])
const progress = computed(() => {
  return (props.currentStep / props.totalStep) * 100
})
</script>

<template>
  <Modal :show-close-button="false">
    <div class="text-white flex flex-col w-64">
      <progress class="w-full rounded-full" id="file" :value="progress" max="100">
        {{ currentStep / totalStep }}
      </progress>
      <div class="mt-4 text-sm flex items-center justify-between">
        <p>{{ text }}</p>
        <div class="flex">
          <i-uim:refresh
            class="mr-2 w-auto h-auto transform animate-spin animate-reverse animate-ease-in-out"
          ></i-uim:refresh>
          <p class="w-max">{{ currentStep }} / {{ totalStep }}</p>
        </div>
      </div>
    </div>
  </Modal>
</template>
