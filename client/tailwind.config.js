/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      width: {
        150: "150px",
        190: "190px",
        225: "225px",
        275: "275px",
        300: "300px",
        340: "340px",
        350: "350px",
        375: "375px",
        460: "460px",
        656: "656px",
        880: "880px",
        508: "508px",
      },
      height: {
        80: "80px",
        150: "150px",
        225: "225px",
        300: "300px",
        340: "340px",
        370: "370px",
        420: "420px",
        510: "510px",
        600: "600px",
        650: "650px",
        685: "685px",
        800: "800px",
        "90vh": "90vh",
      },
      minWidth: {
        210: "210px",
        350: "350px",
        620: "620px",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1800px",
        "2xl": "2024px",
      },
      colors: {
        headingColor: "#2e2e2e",
        textColor: "#515151",
        primary: "#f3f3f3",
        darkOverlay: "rgba(0,0,0,0.2)",
        darkBg: "#121212",
        lightOverlay: "rgba(255,255,255,0.4)",
        lighttextGray: "#9ca0ab",
        card: "rgba(256,256,256,0.8)",
        cartBg: "#282a2c",
        cartItem: "#2e3033",
        cartTotal: "#343739",
        // Dark theme colors
        darkHeadingColor: "#e2e2e2",
        darkTextColor: "#7c7c7c",
        darkPrimary: "#1a1a1a",
        darkCard: "rgba(40, 40, 40, 0.8)",
        darkCartBg: "#1e1e1e",
        darkCartItem: "#232323",
        darkCartTotal: "#282828",
      },
      // Semantic colors
      success: "#28a745",
      warning: "#ffc107",
      error: "#dc3545",
      info: "#17a2b8",

      // Gradient colors
      gradientFrom: "#ff7e5f",
      gradientTo: "#feb47b",

      // Opacity variations
      darkOverlay: {
        50: "rgba(0,0,0,0.05)",
        100: "rgba(0,0,0,0.1)",
        200: "rgba(0,0,0,0.2)",
        300: "rgba(0,0,0,0.3)",
        400: "rgba(0,0,0,0.4)",
        500: "rgba(0,0,0,0.5)",
        600: "rgba(0,0,0,0.6)",
        700: "rgba(0,0,0,0.7)",
        800: "rgba(0,0,0,0.8)",
        900: "rgba(0,0,0,0.9)",
      },
    },
  },
  darkMode: "class", // Enable dark mode using the 'class' strategy
};
