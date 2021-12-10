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
</script>

<template>
  <div class="w-full h-full relative">
    <div class="w-64 h-64 relative rounded-full overflow-hidden">
      <div id="newImage" class="w-full h-full">
        <img class="w-full h-full" id="oldImage" :src="user_image ? user_image : BlankImage" />
        <div
          ref="el"
          class="absolute right-7 bottom-7 w-20 transform origin-center"
          :style="{ transform: `scale(${size.scale})` }"
          :key="jsDelivrLogo"
        >
          <img class="filter drop-shadow-dark" v-if="logo" :src="logo" />
          <img
            class="filter drop-shadow-dark"
            v-else
            :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${jsDelivrLogo}.svg`"
            crossorigin="anonymous"
          />
        </div>
      </div>
    </div>
    <div class="w-64 h-64 rounded-full overflow-hidden absolute -bottom-1 right-2 transform origin-right scale-20">
      <div id="newImage" class="w-full h-full">
        <img class="w-full h-full" id="oldImage" :src="user_image ? user_image : BlankImage" />
        <div
          ref="el"
          class="absolute right-7 bottom-7 w-20 transform origin-center"
          :style="{ transform: `scale(${size.scale})` }"
          :key="jsDelivrLogo"
        >
          <img class="filter drop-shadow-dark" v-if="logo" :src="logo" />
          <img
            class="filter drop-shadow-dark"
            v-else
            :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${jsDelivrLogo}.svg`"
            crossorigin="anonymous"
          />
        </div>
      </div>
    </div>
  </div>
</template>
