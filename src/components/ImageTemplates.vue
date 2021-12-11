<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import ModalUpload from "./ModalUpload.vue"
import { supabase } from "@/supabase"
import { useEventBus } from "@vueuse/core"

const { position, logo, size, name } = toRefs(store.templates)
const bus = useEventBus("new-logo")
bus.on((ev) => {
  console.log(ev)
  fetchSupabaseStorage()
})

const isUploadOpen = ref(false)
const searchTerm = ref("supabase")
const logoList = ref<any[]>([])
const customLogoList = ref<any[]>([])

const computedList = computed(() => {
  return [
    ...logoList.value.map((lg) => {
      return { ...lg, ref: "jsDelivr" }
    }),
    ...customLogoList.value.map((lg) => {
      return { name: lg.name.split(".")[0], shortname: lg.name, ref: "supabase" }
    }),
  ]
})

const fetchSupabaseStorage = () => {
  supabase.storage
    .from("logo")
    .list("public")
    .then((res) => {
      if (res.data) {
        customLogoList.value = res.data
      }
    })
}

onMounted(() => {
  fetch("https://cdn.jsdelivr.net/gh/zernonia/logos/logos.json")
    .then((res) => res.json())
    .then((res) => {
      logoList.value = res
    })
    .catch((error) => console.log(error))

  fetchSupabaseStorage()
})
</script>

<template>
  <div class="flex flex-col w-56">
    <SearchBox :list="computedList" v-model="searchTerm" @selected="logo = $event"> </SearchBox>

    <button class="btn mt-4" @click="isUploadOpen = true">
      <span class="text-white mr-2 text-sm"> Upload custom logo </span>
      <i-uim:upload-alt class="w-auto h-auto text-green-400"></i-uim:upload-alt>
    </button>
    <ModalUpload :list="computedList" v-if="isUploadOpen" @close="isUploadOpen = false" />
  </div>
</template>
