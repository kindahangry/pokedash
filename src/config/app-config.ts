import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "PokeDash",
  version: packageJson.version,
  copyright: `© ${currentYear}, PokeDash.`,
  meta: {
    title: "PokeDash",
    description:
      "PokeDash is a Pokemon analytics dashboard built with Next.js 15, Tailwind CSS v4, and shadcn/ui.",
  },
};
