<script setup lang="ts">
import { store } from "@/scripts/store"
import { computed } from "vue"

const props = defineProps({
  template: {
    type: String,
    default: "",
  },
})

const getLogo = computed(() => {
  return store.logoList.find((lg) => lg.name == props.template)
})

const computedImageLink = computed(() => {
  if (!getLogo.value) return
  return getLogo.value?.ref == "jsDelivr"
    ? `https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${getLogo.value.shortname}.svg`
    : import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/logo/public/" + getLogo.value?.shortname
})
</script>

<template>
  <div class="text-white text-sm">
    <p class="flex">Horray! Someone is using</p>
    <p class="inline-flex underline">
      {{ template
      }}<img class="w-6 h-6 ml-2" v-if="computedImageLink" :src="computedImageLink" alt="new user uses swappy" />
    </p>
  </div>
</template>
