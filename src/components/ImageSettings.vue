<script setup lang="ts">
import { onMounted, ref, toRefs } from "vue"
import { store } from "@/scripts/store"

const { position, logo, jsDelivrLogo, size, name } = toRefs(store.templates)
const logoList = ref<any[]>([])
const selectImage = (ev: Event) => {
  let FR = new FileReader()

  FR.addEventListener("load", function (e) {
    let base64 = e?.target?.result
    if (base64) {
      logo.value = base64 as string
    }
  })

  // @ts-ignore
  FR.readAsDataURL(ev.target.files[0])
  // @ts-ignore
  name.value = ev.target?.files[0].name
}

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
  <div class="flex flex-col">
    <div class="flex">
      <SearchBox v-if="!logo" :list="logoList" v-model="jsDelivrLogo"> </SearchBox>
      <input @change="selectImage" type="file" accept="image/png, image/jpeg" name="logo_upload" id="logo_upload" />
    </div>

    <label for="position">Position</label>
    <div>
      <input type="number" v-model="position.x" />
      <input type="number" v-model="position.y" />
    </div>
    <label for="position">Size</label>
    <div>
      <input type="number" v-model="size.width" />
    </div>
  </div>
</template>
