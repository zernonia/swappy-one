<script setup lang="ts">
import { computed, onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import ModalUpload from "./ModalUpload.vue"
import { supabase } from "@/supabase"
import { Logo } from "@/scripts/interface"

const { position, logo, size, name } = toRefs(store.templates)

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
      return { ...lg, ref: "supabase", shortname: lg.name, name: lg.name.split(".")[0] }
    }),
  ]
})

onMounted(() => {
  fetch("https://cdn.jsdelivr.net/gh/zernonia/logos/logos.json")
    .then((res) => res.json())
    .then((res) => {
      logoList.value = res
    })
    .catch((error) => console.log(error))

  supabase.storage
    .from("logo")
    .list("public")
    .then((res) => {
      if (res.data) {
        customLogoList.value = res.data
      }
    })
})
</script>

<template>
  <div class="flex flex-col w-72">
    <div class="flex items-center py-2">
      <button class="btn btn-white">Logo</button>
      <button class="btn btn-white">Frame</button>
    </div>
    <div class="flex">
      <SearchBox :list="computedList" v-model="searchTerm" @selected="logo = $event"> </SearchBox>

      <button class="p-3 w-10 h-10" @click="isUploadOpen = true">
        <i-uim:upload-alt class="w-auto h-auto"></i-uim:upload-alt>
      </button>
      <ModalUpload v-if="isUploadOpen" @close="isUploadOpen = false" />
    </div>
    <!-- 
    <label for="position">Position</label>
    <div>
      <input type="number" v-model="position.x" />
      <input type="number" v-model="position.y" />
    </div>
    <label for="position">Size</label>
    <div>
      <input type="number" v-model="size.width" />
    </div> -->
  </div>
</template>
