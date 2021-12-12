import { createApp } from "vue"
import App from "./App.vue"
import routes from "virtual:generated-pages"
import { createRouter, createWebHistory } from "vue-router"
import "virtual:windi.css"
import "./assets/main.css"
import "vue-toastification/dist/index.css"
import Umami from "@/plugins/umami"
import Toast, { PluginOptions } from "vue-toastification"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

const toastOptions: PluginOptions = {
  maxToasts: 3,
}
createApp(App).use(Umami).use(Toast).use(router).mount("#app")
