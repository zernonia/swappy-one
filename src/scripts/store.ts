import { reactive } from "vue"
import { useStorage } from "@vueuse/core"
import { User } from "@supabase/gotrue-js"

export const store = reactive({
  user: null as User | null,
  provider_token: {
    token: "",
    secret: "",
  },
  templates: {
    name: "",
    logo: "",
    jsDelivrLogo: "supabase",
    position: {
      x: 160,
      y: 160,
    },
    size: {
      scale: 1,
      width: 70,
    },
  },
})
