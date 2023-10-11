---
tags:
  - tailwind
  - theme
  - css variables
  - dark mode
---

# Tailwind themes with CSS Variables

There are many tailwind theme plugins, tried few and landed on`tailwindcss-themer`.

## Setup

Two files are required:

1. `pnpm i -D tailwindcss-themer`
1. `tailwind.config.js`
1. `app.postcss`

> Technically, we don't need to use CSS variables, but I like to, as I can export them automatically from Figma, or whatever design tool. Without CSS Variables, you could just define the colors in `tailwind.config.js` without touching css files.

```js
// tailwind.config.js

const themer = require('tailwindcss-themer')

/** @type {import('tailwindcss').Config}*/
const config = {
  theme: {
    // ...
  },

  plugins: [
    themer({
      defaultTheme: {
        extend: {
          colors: {
            primary: 'var(--colors-cyan-500)',
            secondary: 'var(--colors-yellow-500)',
            surface: 'var(--colors-gray-100)',
            text: 'var(--colors-gray-900)',
          },
        },
      },
      themes: [
        {
          name: 'darker',
          mediaQuery: '@media (prefers-color-scheme: dark)',
          extend: {
            colors: {
              primary: 'var(--colors-cyan-700)',
              secondary: 'var(--colors-yellow-500)',
              surface: 'var(--colors-gray-900)',
              text: 'var(--colors-gray-100)',
            },
          },
        },
      ],
    }),
  ],
}

module.exports = config
```

```css
/* app.postcss */

@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* colors */
  --colors-cyan-500: rgb(164, 189, 245);
  --colors-cyan-700: #0d398c;
  --colors-gray-100: rgb(255, 255, 255);
  --colors-gray-900: rgb(1, 1, 1);
  --colors-yellow-500: rgb(233, 246, 82);
}
```
