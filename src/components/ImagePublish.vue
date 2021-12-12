<script setup lang="ts">
import { ref, toRefs } from "vue"
import { store } from "@/scripts/store"
import { toBlob } from "html-to-image"
import { supabase } from "@/supabase"
import Selection from "./Selection.vue"
import ModalPublishProgress from "./ModalPublishProgress.vue"
import ModalSuccess from "./ModalSuccess.vue"
import ModalLogin from "./ModalLogin.vue"

const { user, provider_token } = toRefs(store)
const { logo, period } = toRefs(store.templates)

const props = defineProps({
  user_data: {
    type: Object,
  },
  user_image: String,
})

const isPublishing = ref(false)
const isSuccess = ref(false)
const isLoginModalOpen = ref(false)
const currentStep = ref(0)
const currentMsg = ref("")

const periodAvailable = ref([
  { name: "1 day", value: 1 },
  { name: "3 days", value: 3 },
  { name: "1 week", value: 7 },
  { name: "2 weeks", value: 14 },
  { name: "1 month", value: 30 },
  { name: "Forever!", value: 999 },
])

const setStep = (progress: number, msg: string) => {
  currentStep.value = progress
  currentMsg.value = msg
}

const publishImage = async () => {
  if (!user.value?.id) {
    isLoginModalOpen.value = true
    return
  }
  isSuccess.value = false
  isPublishing.value = true
  setStep(0, "Starting...")
  setStep(1, "Backing up old image...")

  const user_id = user.value?.id
  try {
    let oldBlob
    let oldData
    let newBlob
    let newData

    if (!props.user_data?.old_image_key) {
      let oldImage = document.getElementById("oldImage") as HTMLElement
      oldBlob = await toBlob(oldImage)
      if (oldBlob) {
        oldData = await supabase.storage.from("profile-image").upload(`${user_id}/old_image.png`, oldBlob)
      }
    }

    setStep(2, "Saving new image to Supabase")

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

    setStep(3, "Updating your profile picture")

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
        period: period.value.value,
      }),
    }).then((res) => res.json())

    console.log("Showing result", result)
    setStep(4, "Success!")
    isPublishing.value = false
    isSuccess.value = true
  } catch (err) {
    setStep(currentStep.value, "Error publishing...")
    console.log(err)
  }
}
</script>

<template>
  <div class="flex-grow flex flex-col justify-between">
    <div>
      <label for="period">Change for </label>
      <Selection v-model="period" :list="periodAvailable"></Selection>
    </div>
    <button class="btn mt-4 !py-8" :disabled="!user_image" @click="publishImage">
      <span class="mr-2"> Publish now </span>
      <i-uim:telegram-alt class="w-auto h-auto text-green-400"></i-uim:telegram-alt>
    </button>
    <ModalLogin v-if="isLoginModalOpen" @close="isLoginModalOpen = false"></ModalLogin>
    <ModalPublishProgress
      v-if="isPublishing"
      :total-step="4"
      :current-step="currentStep"
      :text="currentMsg"
    ></ModalPublishProgress>
    <ModalSuccess v-if="isSuccess" @close="isSuccess = false"></ModalSuccess>
  </div>
</template>
