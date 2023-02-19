const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

const config = {
  title: 'Memoir',
  tagline: 'Memoirs of developing, deploying, hosting',
  favicon: 'img/favicon.ico',

  url: 'https://memoir.nicco.io',
  baseUrl: '/',

  organizationName: 'cupcakearmy',
  projectName: 'memoir',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/cupcakearmy/memoir/tree/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Memoir',
        items: [
          {
            type: 'doc',
            docId: 'intro',
            position: 'left',
            label: 'Intro',
          },
        ],
      },
      footer: {
        links: [
          {
            title: 'Links',
            items: [
              {
                label: 'Github',
                href: 'https://github.com/cupcakearmy/',
              },
              {
                label: 'Website',
                href: 'https://nicco.io/',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} cupcakearmy, build with ❤️ and 🐘`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
}

module.exports = config
