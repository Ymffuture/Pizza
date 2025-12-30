// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      keyframes: {
        rotate: {
          "0%": { "--angle": "0deg" },
          "100%": { "--angle": "360deg" },
        },
      },
      animation: {
        rotate: "rotate 8s linear infinite",
      },
    },
  },
  // ...rest of your config
};
