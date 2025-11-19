import { ShoppingCart, Store, Vault, Info, type LucideIcon } from "lucide-react";

export interface NavSubItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavMainItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  subItems?: NavSubItem[];
  comingSoon?: boolean;
  newTab?: boolean;
  isNew?: boolean;
}

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Analytics",
    items: [
      {
        title: "Market",
        url: "/market",
        icon: ShoppingCart,
      },
      {
        title: "Vendor",
        url: "/vendor",
        icon: Store,
        comingSoon: true,
      },
      {
        title: "Vault",
        url: "/vault",
        icon: Vault,
        comingSoon: true,
      },
      {
        title: "About",
        url: "/about",
        icon: Info,
        comingSoon: true,
      },
    ],
  },
];
