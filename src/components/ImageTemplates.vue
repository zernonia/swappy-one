<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import ModalUpload from "./ModalUpload.vue"

const { position, logo, jsDelivrLogo, size, name } = toRefs(store.templates)

const isUploadOpen = ref(false)
const logoList = ref<any[]>([])
const logoNew = ref(false)
const logoName = ref("")

onMounted(() => {
  fetch("https://cdn.jsdelivr.net/gh/zernonia/logos/logos.json")
    .then((res) => res.json())
    .then((res) => {
      logoList.value = res
    })
    .catch((error) => console.log(error))
})
</script>

<template>
  <div class="flex flex-col w-72">
    <div class="flex items-center py-2">
      <button class="btn btn-white">Logo</button>
      <button class="btn btn-white">Frame</button>
    </div>
    <div class="flex">
      <SearchBox v-if="!logoNew" :list="logoList" v-model="jsDelivrLogo"> </SearchBox>
      <div v-else>
        <input type="text" v-model="logoName" />
        <button>Ok</button>
      </div>

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
