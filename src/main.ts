import { createApp } from "vue"
import App from "./App.vue"
import routes from "virtual:generated-pages"
import { createRouter, createWebHistory } from "vue-router"
import "virtual:windi.css"
import "./assets/main.css"
import Umami from "@/plugins/umami"
import Toast from "vue-toastification"

const router = createRouter({
  history: createWebHistory(),
  routes,
})

createApp(App).use(Umami).use(Toast).use(router).mount("#app")
