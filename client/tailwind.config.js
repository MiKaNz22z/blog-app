import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      screens: {
        'semi-sm': '760px',
        'md': '830px',  // Thay đổi giá trị md từ 768px thành 820px
        'semi-lg': '1200px'
      },
    },
  },
  plugins: [flowbite.plugin(), require('tailwind-scrollbar'),require('@tailwindcss/line-clamp'),],
}


