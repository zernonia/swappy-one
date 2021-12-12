import { App } from "vue"

function loadScript(options: any) {
  return new Promise((resolve, reject) => {
    const head = document.head || document.getElementsByTagName("head")[0]
    const script = document.createElement("script")

    script.async = true
    script.defer = true
    script.dataset.websiteId = options.websiteId
    script.src = options.scriptUrl

    if (import.meta.env.PROD) {
      head.appendChild(script)

      script.onload = resolve
      script.onerror = reject
    } else {
      resolve("")
    }
  })
}

export default {
  install: async (app: App, options: any) => {
    await loadScript({
      websiteId: "5b4eaf9f-c6cb-4c41-ad14-b527589cc88d",
      scriptUrl: "https://umami-zernonia.vercel.app/umami.js",
    })
  },
}
