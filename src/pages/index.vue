<script setup lang="ts">
import { ref, onMounted, watch, toRefs } from "vue"
import { toBlob } from "html-to-image"
import ButtonLogin from "@/components/ButtonLogin.vue"
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"
import { UserImage } from "@/scripts/interface"
import ImagePreview from "@/components/ImagePreview.vue"
import ImageSettings from "@/components/ImageSettings.vue"
import ImageTemplates from "@/components/ImageTemplates.vue"
import ImageList from "@/components/ImageList.vue"

const id = ref("")
const user_data = ref<UserImage>()
const user_image = ref("")

const { user, provider_token } = toRefs(store)
const { logo } = toRefs(store.templates)

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
  const user_id = user.value?.id
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
      newData = await supabase.storage
        .from("profile-image")
        .upload(`${user_id}/${logo.value.name ? logo.value.name : "new_image"}.png`, newBlob, {
          upsert: true,
        })
    } else {
      return
    }

    const result = await fetch("./api/user/profile_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldkey: oldData?.data?.Key,
        key: newData?.data?.Key,
        template: logo.value.name,
        id: user.value?.id,
        provider_token: provider_token.value,
      }),
    }).then((res) => res.json())

    console.log("Showing result", result)
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
    <div v-if="!user">
      <label for="twitter_id">Twitter name</label>
      <input v-model="id" name="twitter_id" id="twitter_id" type="text" />
      <button @click="searchUser(id)" class="btn">Search</button>
      <ButtonLogin></ButtonLogin>
    </div>

    <button class="btn btn-white" :disabled="!user" @click="uploadImage">Upload</button>

    <div class="flex">
      <ImageTemplates></ImageTemplates>
      <div>
        <ImagePreview :user_image="user_image"></ImagePreview>
        <ImageSettings></ImageSettings>
      </div>
      <!-- <ImageList></ImageList> -->
    </div>
  </div>
</template>
