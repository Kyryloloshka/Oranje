/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./src/**/*.{html,ts}"],

  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        "primary-400": "var(--primary-400)",
        "primary-500": "var(--primary-500)",
        "primary-600": "var(--primary-600)",
        "primary-700": "var(--primary-700)",
        "primary-800": "var(--primary-800)",
        "secondary-500": "var(--secondary-500)",
        "secondary-600": "var(--secondary-600)",
        "secondary-700": "var(--secondary-700)",
        "off-white": "var(--off-white)",
        "dark-1": "var(--dark-1)",
        "dark-2": "var(--dark-2)",
        "dark-3": "var(--dark-3)",
        "dark-4": "var(--dark-4)",
        "dark-5": "var(--dark-5)",
        "dark-6": "var(--dark-6)",
        "light-1": "var(--light-1)",
        "light-2": "var(--light-2)",
        "light-3": "var(--light-3)",
        "light-4": "var(--light-4)",
        "light-5": "var(--light-5)",
        "light-6": "var(--light-6)",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      boxShadow: {
        xl: "0px 0px 15px 5px rgba(255, 112, 174, 0.3)",
        "3xl": "0px 1px 30px -1px rgba(255, 112, 174, 0.2)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
    },
  },
  important: true,
};
