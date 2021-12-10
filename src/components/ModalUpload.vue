<script setup lang="ts">
import { ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import { supabase } from "../supabase"

const emits = defineEmits(["close", "setImage"])
const { logo, name } = toRefs(store.templates)
const logoSrc = ref()
const logoName = ref("")
const logoBlob = ref("")
const logoExt = ref("")
const inputImage = ref()

const selectImage = (ev: Event) => {
  let FR = new FileReader()
  FR.addEventListener("load", function (e) {
    let base64 = e?.target?.result
    if (base64) {
      logoSrc.value = base64 as string
    }
  })
  // @ts-ignore
  FR.readAsDataURL(ev.target.files[0])
  // @ts-ignore
  logoName.value = ev.target?.files[0].name.split(".")[0]
  // @ts-ignore
  logoBlob.value = ev.target?.files[0]
  // @ts-ignore
  logoExt.value = ev.target?.files[0].name.split(".")[1]
}

const uploadImage = async () => {
  const { data, error } = await supabase.storage
    .from("logo")
    .upload(`public/${logoName.value}.${logoExt.value}`, logoBlob.value)
  logo.value = logoSrc.value
  name.value = logoName.value
  emits("close")
}
</script>

<template>
  <section
    class="
      fixed
      top-0
      left-0
      w-screen
      h-screen
      bg-gray-100 bg-opacity-20
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
        shadow-xl
        items-center
        justify-center
        bg-white
        p-8
        rounded-lg
        text-black
        relative
      "
    >
      <button class="absolute -top-2 -right-2" @click="emits('close')">
        <i-uim:times-circle class="w-6 h-6"></i-uim:times-circle>
      </button>
      <button class="w-full h-20 flex justify-center items-center" @click="inputImage.click()">
        <img v-if="logoSrc" class="w-20 h-auto" :src="logoSrc" alt="" />
        <span v-else>large button</span>
      </button>
      <input
        ref="inputImage"
        class="hidden"
        @change="selectImage"
        type="file"
        accept="image/png, image/jpeg"
        name="logo_upload"
        id="logo_upload"
      />
      <div class="flex items-center">
        <input type="text" v-model="logoName" />
        <button class="px-4 py-2" @click="uploadImage">
          <i-uim:upload-alt class="w-auto h-auto"></i-uim:upload-alt>
        </button>
      </div>
    </div>
  </section>
</template>
