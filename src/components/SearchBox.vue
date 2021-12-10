<script setup lang="ts">
import { ref, computed, watch, PropType } from "vue"
import { OnClickOutside } from "@vueuse/components"
import { useDebounce } from "@vueuse/core"
import { supabase } from "@/supabase"
import { Logo } from "@/scripts/interface"

const props = defineProps({
  list: {
    type: Object as PropType<Logo[]>,
    required: true,
  },
  modelValue: {
    required: true,
  },
})

const emits = defineEmits(["update:modelValue", "selected"])

const searchTerm = ref("")
const searchDebounce = useDebounce(searchTerm, 500)

const searchList = computed(() => {
  let s = searchDebounce.value.toLocaleLowerCase().trim()
  if (!s) return []
  return props.list.filter((i) => i.name.toLocaleLowerCase().indexOf(s) > -1)
})

const select = (logo: Logo) => {
  emits("selected", logo)
}

const getSupabaseImageUrl = (name: string) => {
  return import.meta.env.VITE_SUPABASE_URL + "/storage/v1/object/public/logo/public/" + name
}

watch(
  () => props.list,
  () => {
    let obj = props.list.find((i) => i.shortname == props.modelValue)
    searchTerm.value = obj?.name ?? ""
  }
)
</script>

<template>
  <div class="">
    <div class="w-full">
      <div class="relative flex flex-col items-center">
        <i-eva:search-fill class="absolute top-2.5 left-2.5"></i-eva:search-fill>
        <input class="w-full pl-10 bg-gray-100" type="text" placeholder="Search icon..." v-model="searchTerm" />
        <div class="w-full flex flex-col rounded-lg bg-gray-50 h-64 overflow-y-auto">
          <button
            @click="select(item)"
            class="
              border border-gray-200
              inline-flex
              px-4
              py-2
              w-full
              text-left
              hover:bg-gray-50
              focus:outline-transparent focus:ring-transparent
            "
            v-for="item in searchList"
            :key="item.name"
          >
            <img
              class="w-6 h-6 mr-6"
              v-if="item.ref == 'jsDelivr'"
              :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${item.shortname}.svg`"
            />
            <img v-else-if="item.ref == 'supabase'" :src="getSupabaseImageUrl(item.shortname)" alt="" />
            <p>{{ item.name }}</p>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
