import { reactive, ComputedRef } from "vue"
import { useStorage } from "@vueuse/core"
import { User } from "@supabase/gotrue-js"
import { Logo } from "@/scripts/interface"

export const store = reactive({
  user: null as User | null,
  provider_token: {
    token: "",
    secret: "",
  },
  logoList: [] as Logo[],
  templates: useStorage("templates", {
    name: "",
    logo: {
      ref: "jsDelivr",
      name: "supabase",
      shortname: "supabase",
    },
    position: {
      x: 150,
      y: 150,
    },
    size: {
      scale: 1,
      width: 70,
    },
    period: {
      name: "1 week",
      value: 7,
    },
  }),
})
