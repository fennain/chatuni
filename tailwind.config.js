/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  important: true,
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        'mobile': {'max': '768px'},
        'ipad': {'max': '1024px'},
        'desktop': {'min': '1025px'},
      },
      borderWidth: {
        "1PX": "1PX",
        "2PX": "2PX",
        "4PX": "4PX",
      },
      fontSize: {
        "12PX": "12PX",
        "16PX": "16PX",
        "18PX": "18PX",
        "24PX": "24PX",
        "28PX": "28PX",
        "36PX": "36PX",
        "96PX": "96PX",
      },
    },
  },
  plugins: [],
};
