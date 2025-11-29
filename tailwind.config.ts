import type { Config } from "tailwindcss";

const config: Config = {
content: [
  "./src/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
],
  theme: {
    extend: {
      colors: {
        endfield: {
          base: "#09090b",    // 极深黑
          surface: "#18181b", // 表面灰
          accent: "#FCEE21",  // 工业黄
          dim: "#71717a",     // 装饰性暗字
        },
      },
      fontFamily: {
        sans: ["var(--font-oswald)"],
        mono: ["var(--font-jetbrains)"],
      },
      backgroundImage: {
        'tech-grid': "linear-gradient(to right, #27272a 1px, transparent 1px), linear-gradient(to bottom, #27272a 1px, transparent 1px)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'), // 添加这一行
  ],
};
export default config;