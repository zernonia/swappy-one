<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { toBlob } from "html-to-image"
import ButtonLogin from "@/components/ButtonLogin.vue"
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"
import { UserImage } from "@/scripts/interface"
import ImageEditor from "@/components/ImageEditor.vue"
import ImageSettings from "@/components/ImageSettings.vue"

const id = ref("")
const user_data = ref<UserImage>()
const user_image = ref("")

watch(
  () => store.user,
  async (n) => {
    if (n) {
      const { data, error } = await supabase.from("user_image").select("*").single()
      if (data) {
        user_data.value = data
        const imageData = await supabase.storage
          .from("profile-image")
          .download(data.old_image_key.split("profile-image/")[1])

        user_image.value = URL.createObjectURL(imageData.data)
      } else {
        searchUser(store.user?.user_metadata.user_name)
      }
    }
  },
  {
    immediate: true,
  }
)

const searchUser = (screen_name: string) => {
  fetch(`./api/user/${screen_name}`)
    .then((res) => res.json())
    .then((res) => {
      user_image.value = getOriginalImage(res.data.profile_image_url_https)
    })
    .catch((error) => console.log(error))
}

const uploadImage = async () => {
  // check login with Twitter
  console.log("login first!")
  const user_id = store.user?.id
  try {
    let oldBlob
    let oldData
    let newBlob
    let newData

    if (!user_data.value?.old_image_key) {
      let oldImage = document.getElementById("oldImage") as HTMLElement
      oldBlob = await toBlob(oldImage)
      if (oldBlob) {
        oldData = await supabase.storage.from("profile-image").upload(`${user_id}/old_image.png`, oldBlob)
      }
    }
    let newImage = document.getElementById("newImage") as HTMLElement
    newBlob = await toBlob(newImage)
    if (newBlob) {
      newData = await supabase.storage.from("profile-image").upload(`${user_id}/${store.templates.name}.png`, newBlob, {
        upsert: true,
      })
    } else {
      return
    }

    // await fetch("./api/user/profile_image", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     oldkey: oldData?.data?.Key,
    //     key: newData?.data?.Key,
    //     user_id: store.user?.id,
    //     provider_token: store.provider_token,
    //   }),
    // }).then((res) => res.json())
  } catch (err) {
    console.log(err)
  }
}

const getOriginalImage = (image: string) => {
  return image?.replace("_normal", "")
}
</script>

<template>
  <div>
    <div v-if="!store.user">
      <label for="twitter_id">Twitter name</label>
      <input v-model="id" name="twitter_id" id="twitter_id" type="text" />
      <button @click="searchUser(id)" class="btn">Search</button>
      <ButtonLogin></ButtonLogin>
    </div>

    <button class="btn btn-white" :disabled="!store.user" @click="uploadImage">Upload</button>

    <div class="flex">
      <ImageEditor :user_image="user_image"></ImageEditor>
      <ImageSettings></ImageSettings>
    </div>
  </div>
</template>
