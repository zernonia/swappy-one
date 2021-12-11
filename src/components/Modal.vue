<script setup lang="ts">
const props = defineProps({
  showCloseButton: {
    type: Boolean,
    default: true,
  },
})
const emits = defineEmits(["close"])
</script>

<template>
  <section
    class="
      fixed
      top-0
      left-0
      w-screen
      h-screen
      bg-dark-900 bg-opacity-20
      backdrop-filter backdrop-blur
      flex
      items-center
      justify-center
      z-50
    "
  >
    <div
      class="
        w-auto
        h-auto
        flex flex-col
        shadow-xl shadow-green-400
        items-center
        justify-center
        bg-dark-800
        p-8
        rounded-xl
        text-black
        relative
        mb-20
      "
    >
      <button v-if="showCloseButton" class="absolute -top-2 -right-2" @click="emits('close')">
        <i-uim:times-circle class="w-6 h-6 text-green-400"></i-uim:times-circle>
      </button>
      <slot></slot>
    </div>
  </section>
</template>
