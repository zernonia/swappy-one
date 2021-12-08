<script setup lang="ts">
import { ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import { useDraggable, useElementBounding, clamp } from "@vueuse/core"
import BlankImage from "@/assets/twitter-blank.png"

const props = defineProps({
  user_image: {
    type: String,
    required: true,
  },
})
const { position, logo, jsDelivrLogo, size } = toRefs(store.templates)
const el = ref<HTMLElement | null>(null)
const container = ref<HTMLElement | null>(null)
const { x, y, style } = useDraggable(el, {
  initialValue: { x: position.value.x, y: position.value.y },
  onMove() {
    position.value.x = +x.value.toFixed(0) - 31
    position.value.y = +y.value.toFixed(0) - 110
  },
})
</script>

<template>
  <div class="w-64 h-64 relative rounded-full overflow-hidden" ref="container">
    <div id="newImage">
      <img draggable="false" id="oldImage" :src="user_image ?? BlankImage" />
      <div
        ref="el"
        class="absolute cursor-move"
        :style="{
          top: `${position.y}px`,
          left: `${position.x}px`,
          width: `${size.width}px`,
          height: `${size.height}px`,
        }"
      >
        <img draggable="false" v-if="logo" :src="logo" />
        <img
          v-else
          draggable="false"
          :src="`https://cdn.svgporn.com/logos/${jsDelivrLogo}.svg`"
          crossorigin="anonymous"
        />
      </div>
    </div>
  </div>
</template>
