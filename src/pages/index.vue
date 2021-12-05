<script setup lang="ts">
import { ref, onMounted } from "vue"
import { toJpeg } from "html-to-image"
import ButtonLogin from "@/components/ButtonLogin.vue"
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"

const id = ref("")
const user_data = ref()
const newImage = ref()

const logoList = ref<any[]>([])
const logoSrc = ref("")
const logoSelected = ref("vue")

const searchUser = () => {
  fetch(`./api/user/${id.value}`)
    .then((res) => res.json())
    .then((res) => {
      user_data.value = res.data
    })
    .catch((error) => console.log(error))
}

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
}

const uploadImage = () => {
  // check login with Twitter
  console.log("login first!")
  const random_string = Math.random().toString(36).slice(2)
  const user_id = store.user?.id

  toJpeg(newImage.value).then(async (dataUrl) => {
    const { data, error } = await supabase.storage
      .from("profile-image")
      .upload(`${user_id}/${random_string}.jpg`, dataUrl)

    fetch("./api/user/profile_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        key: data?.Key,
        token: store.provider_token,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res)
      })
      .catch((error) => {
        console.log(error)
      })
  })
}

const getOriginalImage = (image: string) => {
  return image?.replace("_normal", "")
}

onMounted(() => {
  fetch("https://cdn.jsdelivr.net/gh/gilbarbara/logos@latest/logos.json")
    .then((res) => res.json())
    .then((res) => {
      logoList.value = res
    })
    .catch((error) => console.log(error))
})
</script>

<template>
  <div>
    <label for="twitter_id">Twitter name</label>
    <input v-model="id" name="twitter_id" id="twitter_id" type="text" />
    <button @click="searchUser" class="btn">Search</button>

    <select v-model="logoSelected" id="logos" name="logos">
      <option v-for="logo in logoList" :value="logo.shortname">{{ logo.name }}</option>
    </select>

    <input @change="selectImage" type="file" name="logo_upload" id="logo_upload" />

    <button class="btn btn-white" @click="uploadImage">Upload</button>

    <ButtonLogin v-if="!store.user"></ButtonLogin>

    <div class="w-64 h-64 relative rounded-full overflow-hidden">
      <div ref="newImage">
        <img
          :src="
            getOriginalImage(user_data?.profile_image_url_https) ??
            'https://pbs.twimg.com/profile_images/1419846185519513601/aIz1i1Oh.jpg'
          "
        />
        <div class="absolute w-10 h-10 bottom-6 right-6">
          <img v-if="logoSrc" :src="logoSrc" />
          <img v-else :src="`https://cdn.svgporn.com/logos/${logoSelected ?? 'vue'}.svg`" crossorigin="anonymous" />
        </div>
        {{ user_data }}
      </div>
    </div>
  </div>
</template>
