<script setup lang="ts">
import { computed, toRefs } from "vue"
import { store } from "@/scripts/store"
import BlankImage from "@/assets/twitter-blank.png"

const props = defineProps({
  user_image: {
    type: String,
    required: true,
  },
})
const { position, logo, size } = toRefs(store.templates)

const getSupabaseImageUrl = (name: string) => {
  return import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/logo/public/" + name
}
const computedTransform = computed(() => {
  return {
    transform: `scale(${size.value.scale}) translate(${position.value.x}px, ${position.value.y}px)`,
  }
})
</script>

<template>
  <div class="w-full relative">
    <div class="w-64 h-64 relative rounded-full overflow-hidden">
      <div id="newImage" class="w-full h-full">
        <img class="w-full h-full" id="oldImage" :src="user_image ? user_image : BlankImage" />
        <div
          ref="el"
          class="absolute right-7 bottom-7 w-20 transform origin-center"
          :style="computedTransform"
          :key="logo.name"
        >
          <img
            class="filter drop-shadow-dark"
            v-if="logo.ref == 'jsDelivr'"
            :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${logo.shortname}.svg`"
            crossorigin="anonymous"
          />
          <img
            class="filter drop-shadow-dark"
            v-else-if="logo.ref == 'supabase'"
            :src="getSupabaseImageUrl(logo.shortname)"
            crossorigin="anonymous"
          />
        </div>
      </div>
    </div>
    <div class="w-64 h-64 rounded-full overflow-hidden absolute bottom-0 -right-2 transform origin-right scale-20">
      <div id="newImage" class="w-full h-full">
        <img class="w-full h-full" id="oldImage" :src="user_image ? user_image : BlankImage" />
        <div class="absolute right-7 bottom-7 w-20 transform origin-center" :style="computedTransform" :key="logo.name">
          <img
            class="filter drop-shadow-dark"
            v-if="logo.ref == 'jsDelivr'"
            :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${logo.shortname}.svg`"
            crossorigin="anonymous"
          />
          <img
            class="filter drop-shadow-dark"
            v-else-if="logo.ref == 'supabase'"
            :src="getSupabaseImageUrl(logo.shortname)"
            crossorigin="anonymous"
          />
        </div>
      </div>
    </div>
  </div>
</template>
