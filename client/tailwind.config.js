/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        galaxy: '#274d6a',
        astronaut:
          "url('https://scontent.fsgn5-8.fna.fbcdn.net/v/t39.30808-6/464479350_526162490183666_4116552953255254454_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_eui2=AeEGYKTc3oFY17aLvMyAohtTzUln2vHjAUzNSWfa8eMBTDpXzQVvL5C1iAwkP7cJ3RCaAlLaGwexK3hKdf1fxoq3&_nc_ohc=CX9enTOmhfoQ7kNvgHDK5Mc&_nc_zt=23&_nc_ht=scontent.fsgn5-8.fna&_nc_gid=Arf3tZ26uO3U_uvFKtBOROW&oh=00_AYAJO3mmUsRGuUOV_4jZ-UkH21p5A-KCRZra204IvPZavA&oe=672155EC')",
      },
      clipPath: {
        custom: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%);',
        custom1: 'polygon(0 0, 100% 0, 100% 100px, 0 100px)',
      },
      fontFamily: {
        poppins: ['Pacifico', 'sans-serif'],
        dancing: ['Dancing Script', 'cursive'],
        roboto: ['Roboto', 'sans-serif'],
      },
      letterSpacing: {
        10: '20px',
      },
      width: {
        150: '150px',
        120: '120px',
        190: '190px',
        225: '225px',
        275: '275px',
        300: '300px',
        340: '340px',
        350: '350px',
        375: '375px',
        400: '400px',
        360: '360px',
        460: '460px',
        656: '656px',
        880: '880px',
        508: '508px',
      },
      textShadow: {
        custom: '0 5px 10px rgba(0, 0, 0, 0.25)',
      },
      spacing: {
        120: '120px',
      },
      margin: {
        120: '120px',
      },
      height: {
        80: '80px',
        150: '150px',
        225: '225px',
        300: '300px',
        345: '345px',
        340: '340px',
        370: '370px',
        420: '420px',
        510: '510px',
        270: '270px',
        650: '650px',
        685: '685px',
        800: '800px',
        '90vh': '90vh',
        '70%': '70%',
        'calc-minus-120': 'calc(100vh - 120px)',
        '800vh': '800vh',
      },
      minWidth: {
        210: '210px',
        350: '350px',
        620: '620px',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1800px',
        '2xl': '2024px',
      },
      translate: {
        '-50%': '-50%',
      },
      colors: {
        stepFinish: '#4caf50', // Xanh lá cây
        stepProcess: '#ff9800', // Cam
        stepWait: '#d9d9d9',
        headingColor: '#2e2e2e',
        textColor: '#515151',
        primary: '#f3f3f3',
        primaryColor: '#EF4444',
        darkOverlay: 'rgba(0,0,0,0.2)',
        darkBg: '#121212',
        darkBorder: '#334155',
        lightOverlay: 'rgba(255,255,255,0.4)',
        galaxyOverlay: 'rgba(72,72,72, 0.2)',
        lighttextGray: '#9ca0ab',
        card: 'rgba(256,256,256,0.8)',
        cartBg: '#282a2c',
        cartItem: '#2e3033',
        cartTotal: '#343739',
        galaxy: '#061019',
        // Dark theme colors
        darkHeadingColor: '#e2e2e2',
        darkTextColor: '#7c7c7c',
        darkPrimary: '#1a1a1a',
        darkCard: 'rgba(40, 40, 40, 0.8)',
        darkCartBg: '#1e1e1e',
        darkCartItem: '#232323',
        darkCartTotal: '#282828',
      },
      // Semantic colors
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      info: '#17a2b8',

      // Gradient colors
      gradientFrom: '#ff7e5f',
      gradientTo: '#feb47b',

      // Opacity variations
      darkOverlay: {
        50: 'rgba(0,0,0,0.05)',
        100: 'rgba(0,0,0,0.1)',
        200: 'rgba(0,0,0,0.2)',
        300: 'rgba(0,0,0,0.3)',
        400: 'rgba(0,0,0,0.4)',
        500: 'rgba(0,0,0,0.5)',
        600: 'rgba(0,0,0,0.6)',
        700: 'rgba(0,0,0,0.7)',
        800: 'rgba(0,0,0,0.8)',
        900: 'rgba(0,0,0,0.9)',
      },
    },
  },
  darkMode: 'class', // Enable dark mode using the 'class' strategy
  plugins: [require('tailwind-clip-path'), require('tailwindcss-filters')],
};
