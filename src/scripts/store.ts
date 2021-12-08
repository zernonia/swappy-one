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
    logo: "",
    jsDelivrLogo: "vue",
    position: {
      x: 40,
      y: 40,
    },
    size: {
      width: 40,
      height: 40,
    },
  },
})
