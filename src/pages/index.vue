<script setup lang="ts">
import { ref, onMounted, watch, toRefs } from "vue"
import { useToast } from "vue-toastification"
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
import ToastNewUser from "@/components/ToastNewUser.vue"
import { useEventBus } from "@vueuse/core"

const bus = useEventBus("fetch_user_data")

const id = ref("")
const user_data = ref<UserImage>()
const user_image = ref("")

const toast = useToast()
const { user } = toRefs(store)

const setUserData = async () => {
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

bus.on(async () => {
  await setUserData()
})
watch(
  user,
  async (n) => {
    if (n) {
      await setUserData()
    }
  },
  {
    immediate: true,
  }
)

onMounted(() => {
  const historySubscription = supabase
    .from("user_history")
    .on("INSERT", (payload) => {
      const new_data = payload.new
      toast.success({
        component: ToastNewUser,
        props: {
          template: new_data.template,
        },
      })
    })
    .subscribe()
})

const searchUser = (screen_name: string) => {
  if (!screen_name) return
  fetch(`./api/user/${screen_name}`)
    .then((res) => res.json())
    .then((res) => {
      user_image.value = getOriginalImage(res.data.profile_image_url_https)
    })
    .catch((error) => {
      toast.error("No user found")
    })
}

const getOriginalImage = (image: string) => {
  return image?.replace("_normal", "")
}
</script>

<template>
  <div id="step0" v-if="!user" class="flex flex-col md:flex-row md:space-x-2 z-5">
    <div class="flex space-x-2">
      <input
        v-model="id"
        name="twitter_id"
        class="bg-dark-300 text-white"
        placeholder="Twitter handler "
        id="twitter_id"
        type="text"
        @keyup.enter="searchUser(id)"
      />
      <button @click="searchUser(id)" class="btn !p-2 !w-9 !h-9">
        <i-eva:search-fill class="text-green-400"></i-eva:search-fill>
      </button>
    </div>
    <ButtonLogin class="mt-4 md:mt-0"></ButtonLogin>
  </div>
  <div class="px-1 mt-12 md:mt-4 w-full flex items-center justify-center">
    <div class="relative flex h-full w-full max-w-screen-md rounded-2xl">
      <div class="z-10 w-full bg-dark-700 rounded-2xl p-6 md:p-4">
        <div class="z-20 absolute -top-6 right-6 md:-top-4 -right-4 flex items-center space-x-2">
          <a
            href="https://github.com/zernonia/swappy-one"
            target="_blank"
            rel="noopener"
            class="rounded-full bg-dark-500 !p-0 !w-9 !h-9 btn shadow-md"
          >
            <i-uim:github-alt class="text-green-400"></i-uim:github-alt>
          </a>
          <a
            href="https://twitter.com/zernonia"
            target="_blank"
            rel="noopener"
            class="rounded-full bg-dark-500 !p-0 !w-9 !h-9 btn shadow-md"
          >
            <i-uim:twitter-alt class="text-green-400"></i-uim:twitter-alt>
          </a>
        </div>
        <ButtonLogout v-if="user" class="absolute -bottom-4 -right-4"></ButtonLogout>
        <div class="flex flex-col md:flex-row h-full">
          <ImageTemplates class="md:mr-4 w-full md:w-56" id="step1"></ImageTemplates>
          <div class="md:mx-4 my-8 md:my-0" id="step2">
            <ImagePreview :user_image="user_image"></ImagePreview>
            <ImageSettings></ImageSettings>
          </div>
          <div class="md:ml-4 w-full md:w-56 flex flex-col" id="step3">
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
