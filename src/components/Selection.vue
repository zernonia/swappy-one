<script setup lang="ts">
import { ref, PropType } from "vue"
import { OnClickOutside } from "@vueuse/components"

interface Selection {
  name: string
  value: any
}

const props = defineProps({
  list: {
    type: Object as PropType<Selection[]>,
    required: true,
  },
  modelValue: {
    type: Object as PropType<Selection>,
    required: true,
  },
})

const emits = defineEmits(["update:modelValue"])
const isSelectionOpen = ref(false)

const select = (item: Selection) => {
  isSelectionOpen.value = false
  emits("update:modelValue", item)
}
</script>

<template>
  <div class="mt-2">
    <div class="w-full text-white">
      <OnClickOutside @trigger="isSelectionOpen = false">
        <div class="relative flex items-center">
          <button class="btn !bg-dark-300" @click="isSelectionOpen = true">{{ modelValue.name }}</button>
          <transition name="slide-top-down">
            <div
              v-if="isSelectionOpen"
              class="
                mt-4
                shadow-xl
                text-sm
                z-100
                absolute
                w-full
                max-h-64
                overflow-y-auto
                top-full
                left-0
                flex flex-col
                rounded-xl
                bg-dark-400
              "
            >
              <button
                @click="select(item)"
                class="btn !rounded-none hover:bg-dark-300"
                v-for="item in list"
                :key="item.name"
              >
                {{ item.name }}
              </button>
            </div>
          </transition>
        </div>
      </OnClickOutside>
    </div>
  </div>
</template>
