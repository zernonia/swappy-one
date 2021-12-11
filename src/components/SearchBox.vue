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
  <div class="w-full h-full">
    <div class="relative h-full flex flex-col items-center">
      <i-eva:search-fill class="absolute top-2 left-4 text-green-400"></i-eva:search-fill>
      <input
        class="w-full !pl-16 bg-dark-300 text-white placeholder-white"
        type="text"
        placeholder="Search icon..."
        v-model="searchTerm"
      />
      <div class="mt-4 w-full h-full max-h-74 flex flex-col rounded-xl bg-dark-400 text-white overflow-y-auto">
        <button
          @click="select(item)"
          class="btn !justify-start !rounded-none !text-left"
          v-for="item in searchList"
          :key="item.name"
        >
          <img
            class="w-6 h-6 mr-6"
            v-if="item.ref == 'jsDelivr'"
            :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${item.shortname}.svg`"
          />
          <img
            class="w-6 h-6 mr-6 object-contain"
            v-else-if="item.ref == 'supabase'"
            :src="getSupabaseImageUrl(item.shortname)"
            alt=""
          />
          <p>{{ item.name }}</p>
        </button>
      </div>
    </div>
  </div>
</template>
