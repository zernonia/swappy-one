<script setup lang="ts">
import { PropType, ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import { supabase } from "../supabase"
import Modal from "./Modal.vue"
import { Logo } from "@/scripts/interface"
import { useEventBus } from "@vueuse/core"

const bus = useEventBus("new-logo")

const props = defineProps({
  list: {
    type: Object as PropType<Logo[]>,
    default: [],
  },
})

const emits = defineEmits(["close", "setImage"])
const { logo, name } = toRefs(store.templates)
const logoSrc = ref()
const logoName = ref("")
const logoBlob = ref("")
const logoExt = ref("")
const inputImage = ref()
const errorText = ref("")
const isLoading = ref(false)

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
  errorText.value = ""
  isLoading.value = true
  if (props.list.find((lg) => lg.name.toLowerCase() == logoName.value.toLowerCase())) {
    errorText.value = "Please use another name"
    isLoading.value = false
    return
  }
  const { data, error } = await supabase.storage
    .from("logo")
    .upload(`public/${logoName.value}.${logoExt.value}`, logoBlob.value)

  if (data) {
    logo.value = {
      name: logoName.value,
      shortname: `${logoName.value}.${logoExt.value}`,
      ref: "supabase",
    }
    name.value = logoName.value
    bus.emit("new logo")
    emits("close")
  } else {
    errorText.value = "Please use another name"
    isLoading.value = false
  }
}
</script>

<template>
  <Modal @close="emits('close')">
    <button
      class="
        max-w-72
        w-full
        h-30
        flex
        justify-center
        items-center
        text-white
        border-dashed border-3 border-green-400
        rounded-xl
        animate-duration-500 animate-ease-linear animate-bounce-in
      "
      @click="inputImage.click()"
    >
      <img v-if="logoSrc" class="w-auto h-30 object-contain" :src="logoSrc" alt="" />
      <span v-else>Click here to Upload...</span>
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
    <div class="flex items-center mt-4">
      <input
        type="text"
        class="w-full bg-dark-300 text-white placeholder-white placeholder-opacity-50"
        placeholder="Logo name"
        v-model="logoName"
      />
      <button
        :disabled="!logoBlob || !logoName"
        class="px-2 py-2 text-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
        @click="uploadImage"
      >
        <i-uim:upload-alt v-if="!isLoading" class="!w-9 !h-9 !p-2 btn"></i-uim:upload-alt>
        <i-uim:refresh v-else class="w-auto h-auto animate-spin animate-ease-in-out"></i-uim:refresh>
      </button>
    </div>
    <span class="text-red-400 text-xs self-start mt-1 ml-4" v-if="errorText">{{ errorText }}</span>
  </Modal>
</template>
