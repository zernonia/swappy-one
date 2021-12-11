<script setup lang="ts">
import { computed, ref } from "vue"
import { store } from "@/scripts/store"
import Modal from "./Modal.vue"
import ButtonLogin from "./ButtonLogin.vue"
import TermsPrivacy from "./TermsPrivacy.vue"

const emits = defineEmits(["close"])
</script>

<template>
  <Modal :show-close-button="true" @close="emits('close')">
    <div class="text-white flex flex-col items-center w-64">
      <i-uim:twitter-alt
        class="text-6xl text-green-400 animate-duration-700 animate-ease-in-out animate-bounce-in"
      ></i-uim:twitter-alt>
      <h1 class="mt-4">Please login to continue!</h1>
      <ButtonLogin class="mt-2"></ButtonLogin>
      <TermsPrivacy class="mt-2"></TermsPrivacy>
    </div>
  </Modal>
</template>
