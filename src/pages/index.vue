<script setup lang="ts">
import { ref, onMounted, watch } from "vue"
import { toBlob } from "html-to-image"
import ButtonLogin from "@/components/ButtonLogin.vue"
import BlankImage from "@/assets/twitter-blank.png"
import { store } from "@/scripts/store"
import { supabase } from "@/supabase"

const id = ref("")
const user_data = ref({})
const user_image = ref("")
const oldImage = ref()
const newImage = ref()

const logoList = ref<any[]>([])
const logoSrc = ref("")
const logoSelected = ref("vue")

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
        fetch(`./api/user/${store.user?.user_metadata.user_name}`)
          .then((res) => res.json())
          .then((res) => {
            user_image.value = getOriginalImage(res.data.profile_image_url_https)
          })
          .catch((error) => console.log(error))
      }
    }
  },
  {
    immediate: true,
  }
)

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

const uploadImage = async () => {
  // check login with Twitter
  console.log("login first!")
  const user_id = store.user?.id
  try {
    var oldBlob
    var oldData
    if (!user_data.value.old_image_key) {
      oldBlob = await toBlob(oldImage.value)
      oldData = await supabase.storage.from("profile-image").upload(`${user_id}/old_image.png`, oldBlob)
    }
    const newBlob = await toBlob(newImage.value)
    const newData = await supabase.storage.from("profile-image").upload(`${user_id}/new_image.png`, newBlob, {
      upsert: true,
    })

    await fetch("./api/user/profile_image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        oldkey: oldData?.data?.Key,
        key: newData.data?.Key,
        user_id: store.user?.id,
        provider_token: store.provider_token,
      }),
    }).then((res) => res.json())
  } catch (err) {
    console.log(err)
  }
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
    <select v-model="logoSelected" id="logos" name="logos">
      <option v-for="logo in logoList" :value="logo.shortname">{{ logo.name }}</option>
    </select>

    <input @change="selectImage" type="file" name="logo_upload" id="logo_upload" />

    <button class="btn btn-white" :disabled="!store.user" @click="uploadImage">Upload</button>

    <ButtonLogin v-if="!store.user"></ButtonLogin>

    <div class="w-64 h-64 relative rounded-full overflow-hidden">
      <div ref="newImage">
        <img ref="oldImage" :src="user_image ?? BlankImage" />
        <div class="absolute w-10 h-10 bottom-3 left-16">
          <img v-if="logoSrc" :src="logoSrc" />
          <img v-else :src="`https://cdn.svgporn.com/logos/${logoSelected ?? 'vue'}.svg`" crossorigin="anonymous" />
        </div>
      </div>
    </div>
  </div>
</template>
