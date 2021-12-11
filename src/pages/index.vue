<script setup lang="ts">
import { ref, onMounted, watch, toRefs } from "vue"
import ButtonLogin from "@/components/ButtonLogin.vue"
import ButtonLogout from "@/components/ButtonLogout.vue"
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"
import { UserImage } from "@/scripts/interface"
import ImagePreview from "@/components/ImagePreview.vue"
import ImageSettings from "@/components/ImageSettings.vue"
import ImageTemplates from "@/components/ImageTemplates.vue"
import ImageList from "@/components/ImageList.vue"
import ImagePublish from "@/components/ImagePublish.vue"
import PoweredBy from "@/components/PoweredBy.vue"

const id = ref("")
const user_data = ref<UserImage>()
const user_image = ref("")

const { user } = toRefs(store)

watch(
  user,
  async (n) => {
    if (n) {
      const { data, error } = await supabase.from("user").select("*").single()
      if (data) {
        user_data.value = data
        const imageData = await supabase.storage
          .from("profile-image")
          .download(data.old_image_key?.split("profile-image/")[1])

        if (imageData.data) {
          user_image.value = URL.createObjectURL(imageData.data)
        } else {
          searchUser(user.value?.user_metadata.user_name)
        }
      } else {
        searchUser(user.value?.user_metadata.user_name)
      }
    }
  },
  {
    immediate: true,
  }
)

const searchUser = (screen_name: string) => {
  if (!screen_name) return
  fetch(`./api/user/${screen_name}`)
    .then((res) => res.json())
    .then((res) => {
      user_image.value = getOriginalImage(res.data.profile_image_url_https)
    })
    .catch((error) => console.log(error))
}

const getOriginalImage = (image: string) => {
  return image?.replace("_normal", "")
}
</script>

<template>
  <div id="step0" v-if="!user" class="flex space-x-2 z-5">
    <input
      v-model="id"
      name="twitter_id"
      class="bg-dark-300 text-white"
      placeholder="Twitter name"
      id="twitter_id"
      type="text"
    />
    <button @click="searchUser(id)" class="btn">Search</button>
    <ButtonLogin></ButtonLogin>
  </div>
  <div class="px-1 mt-8 w-full flex items-center justify-center">
    <div class="relative flex h-full w-full max-w-screen-md rounded-2xl">
      <div class="z-10 w-full bg-dark-700 rounded-2xl p-4">
        <ButtonLogout v-if="user" class="absolute -bottom-4 -right-4"></ButtonLogout>
        <div class="flex h-full">
          <ImageTemplates class="mr-4" id="step1"></ImageTemplates>
          <div class="mx-4" id="step2">
            <ImagePreview :user_image="user_image"></ImagePreview>
            <ImageSettings></ImageSettings>
          </div>
          <div class="ml-4 w-56 flex flex-col" id="step3">
            <ImagePublish :user_image="user_image" :user_data="user_data"></ImagePublish>
            <!-- <div class="h-0.5 w-full rounded-full bg-dark-300 my-4"></div> -->
            <PoweredBy></PoweredBy>
          </div>
          <!-- <ImageList></ImageList> -->
        </div>
      </div>

      <div class="absolute w-full h-full bg-conic-gradient filter blur-xl"></div>
      <div class="absolute w-full h-full bg-conic-gradient filter blur-3xl opacity-60 animate-pulse-slow"></div>
      <div class="absolute -inset-1 rounded-2xl bg-conic-gradient"></div>
    </div>
  </div>
</template>
