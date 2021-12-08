<script setup lang="ts">
import { ref, computed, watch } from "vue"
import { OnClickOutside } from "@vueuse/components"
import { useDebounce } from "@vueuse/core"

const props = defineProps({
  list: {
    type: Array,
    required: true,
  },
  modelValue: {
    required: true,
  },
})

const emits = defineEmits(["update:modelValue"])

const isSelectionOpen = ref(false)

const searchTerm = ref("")
const searchDebounce = useDebounce(searchTerm, 500)

const searchList = computed(() => {
  let s = searchDebounce.value.toLocaleLowerCase().trim()
  if (!s) return []
  return props.list.filter((i) => i.name.toLocaleLowerCase().indexOf(s) > -1)
})

const select = (shortname: string) => {
  isSelectionOpen.value = false
  emits("update:modelValue", shortname)
}

watch(
  () => props.list,
  () => {
    let obj = props.list.find((i) => i.shortname == props.modelValue)
    searchTerm.value = obj?.name
  }
)
</script>

<template>
  <div class="">
    <div class="w-full">
      <OnClickOutside @trigger="isSelectionOpen = false">
        <div class="relative flex items-center">
          <i-eva:search-fill class="absolute left-2"></i-eva:search-fill>
          <input class="w-full pl-8" type="text" v-model="searchTerm" @focus="isSelectionOpen = true" @blur="" />
          <div
            v-if="isSelectionOpen"
            class="
              shadow-xl
              z-100
              absolute
              w-full
              max-h-64
              overflow-y-auto
              top-full
              left-0
              flex flex-col
              rounded-lg
              bg-white
            "
          >
            <button
              @click="select(item.shortname)"
              class="inline-flex px-4 py-2 w-full hover:bg-gray-50 focus:outline-transparent focus:ring-transparent"
              v-for="item in searchList"
              :key="item.name"
            >
              <img
                class="w-6 h-6 mr-6"
                :src="`https://cdn.jsdelivr.net/gh/zernonia/logos/logos/${item.shortname}.svg`"
              />
              <p>{{ item.name }}</p>
            </button>
          </div>
        </div>
      </OnClickOutside>
    </div>
  </div>
</template>
