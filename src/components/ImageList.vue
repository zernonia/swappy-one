<script setup lang="ts">
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"
import { onMounted, ref } from "vue"

const imageList = ref<any[]>([])

const downloadImage = async (image: any) => {
  const { data } = await supabase.storage.from("profile-image").download(`${store.user?.id}/${image}`)
  return URL.createObjectURL(data as Blob)
}

onMounted(async () => {
  const { data, error } = await supabase.storage.from("profile-image").list(store.user?.id, {
    limit: 100,
    offset: 0,
    sortBy: { column: "created_at", order: "asc" },
  })
  if (data) {
    imageList.value = data
    imageList.value.forEach(async (img, i) => {
      imageList.value[i].src = await downloadImage(img.name)
    })
  }
})
</script>

<template>
  <div class="ml-4">
    <div v-for="image in imageList" :key="image.id">
      <img class="w-26 h-26 rounded-full" v-if="image.src" :src="image.src" alt="" />
    </div>
  </div>
</template>
