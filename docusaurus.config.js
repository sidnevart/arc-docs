// @ts-check

const config = {
  title: "ARC",
  tagline: "CLI и desktop для локальной работы с AI над проектом",
  favicon: "img/arc-logo-mark.svg",
  url: "http://localhost",
  baseUrl: "/",
  organizationName: "local",
  projectName: "agent-os",
  onBrokenLinks: "throw",
  i18n: {
    defaultLocale: "ru",
    locales: ["ru"]
  },
  markdown: {
    hooks: {
      onBrokenMarkdownLinks: "warn"
    }
  },
  presets: [
    [
      "classic",
      {
        docs: {
          sidebarPath: require.resolve("./sidebars.js"),
          routeBasePath: "/"
        },
        blog: false,
        theme: {
          customCss: require.resolve("./src/css/custom.css")
        }
      }
    ]
  ],
  themeConfig: {
    navbar: {
      title: "ARC",
      logo: {
        alt: "ARC logo",
        src: "img/arc-logo-mark.svg"
      },
      items: [
        {to: "/", label: "Обзор", position: "left"},
        {to: "/install", label: "Установка", position: "left"},
        {to: "/quickstart", label: "Быстрый старт", position: "left"},
        {to: "/desktop-guide", label: "Desktop", position: "left"},
        {to: "/cli-guide", label: "CLI", position: "left"},
        {to: "/commands", label: "Команды", position: "left"}
      ]
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Документация",
          items: [
            {label: "Обзор", to: "/"},
            {label: "Установка", to: "/install"},
            {label: "Быстрый старт", to: "/quickstart"}
          ]
        },
        {
          title: "Руководства",
          items: [
            {label: "Desktop для новичков", to: "/desktop-guide"},
            {label: "CLI для новичков", to: "/cli-guide"},
            {label: "Первый сценарий", to: "/first-task"}
          ]
        },
        {
          title: "Справка",
          items: [
            {label: "Команды", to: "/commands"},
            {label: "FAQ", to: "/faq"},
            {label: "Скриншоты", to: "/screenshots"}
          ]
        }
      ]
    }
  }
};

module.exports = config;
