<script setup lang="ts">
import { computed, ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import Modal from "./Modal.vue"

const { logo } = toRefs(store.templates)

const emits = defineEmits(["close"])
const computedLink = computed(() => `https://www.swappy.one/?template=${logo.value.name}`)
const msg = computed(
  () =>
    `If you want to change your Twitter profile temporarily, check out Swappy.One by @zernonia!%0A%0AI'm currently using ${logo.value.name}!`
)
</script>

<template>
  <Modal :show-close-button="true" @close="emits('close')">
    <div class="text-white flex flex-col items-center w-64">
      <i-uim:check-circle
        class="text-6xl text-green-400 animate-duration-700 animate-ease-in-out animate-bounce-in"
      ></i-uim:check-circle>
      <h1 class="mt-4">Successfully published!</h1>
      <p class="text-sm mb-2">Share with your friends on Twitter!</p>
      <div class="mt-2 flex items-center">
        <input class="bg-dark-300" :value="computedLink" type="text" />
        <a
          :href="`https://twitter.com/intent/tweet?original_referer=${computedLink}&text=${msg}&url=${computedLink}`"
          target="_blank"
          rel="noopener"
          class="btn !h-9 !w-9 !p-0 ml-2"
        >
          <i-uim:twitter-alt class="text-green-400"></i-uim:twitter-alt>
        </a>
      </div>
    </div>
  </Modal>
</template>
