import { defineConfig } from "windicss/helpers"

const conicGradient = (theme, direction, colorList) => {
  const params = [direction, ...colorList.map((color) => theme(`colors.${color}`))]

  return `conic-gradient(${params.join(", ")})`
}

export default defineConfig({
  theme: {
    extend: {
      dropShadow: { dark: "0 5px 5px rgba(0, 0, 0, 0.35)" },
      backgroundImage: (theme) => ({
        "conic-gradient": conicGradient(theme, "from 300deg", [
          "emerald.400",
          "green.100",
          "emerald.300",
          "emerald.700",
          "green.100",
          "green.100",
          "emerald.600",
          "emerald.400",
        ]),
      }),
      textShadow: {
        green: "0 0px 4px #4edaa6",
      },
      animation: {
        "pulse-slow": "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        background: "change 3s ease infinite",
      },
      keyframes: {
        change: {
          "0%, 100%": {
            "background-position": "0% 50%",
          },
          "50%": {
            "background-position": "100% 50%",
          },
        },
      },
    },
  },
})
