export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Admin-RedGodely",
  description: "Admin-RedGodely is a web application that allows you to manage products, bundles, categories, and promotions.",
  navItems: [
    {
      label: "Products",
      href: "/products",
    },
    {
      label: "Bundles",
      href: "/bundles",
    },
    {
      label: "Categories",
      href: "/categories",
    },
    {
      label: "Promotions",
      href: "/promotions",
    },
  ],
  links: {
    github: "https://github.com/Red-Team-Software",
    discord: "https://discordapp.com/channels/1302812306501013546/1302812307088474144",
    sponsor: "https://modulo7.ucab.edu.ve/",
  },
};
