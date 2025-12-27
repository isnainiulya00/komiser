/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Warna biru utama untuk tombol dan ikon, diambil dari desain
        primary: '#0090FF',
        // Warna background abu-abu terang untuk seluruh halaman
        'light-gray': '#f8fafc',
      },
      fontFamily: {
        // Menggunakan font 'Inter' agar terlihat modern dan bersih
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}