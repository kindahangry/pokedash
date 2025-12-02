import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Pokedash",
  version: packageJson.version,
  copyright: `© ${currentYear}, Pokedash.`,
  meta: {
    title: "Pokedash",
    description:
      "Pokedash is a Pokemon analytics dashboard built with Next.js 15, Tailwind CSS v4, and shadcn/ui.",
  },
};
