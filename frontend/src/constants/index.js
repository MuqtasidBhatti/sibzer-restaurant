// ─── API ────────────────────────────────────────────────────────────────────
export const API_URL = import.meta.env.VITE_API_URL;

// ─── ORDER ──────────────────────────────────────────────────────────────────
export const ORDER_TYPES = [
  { value: "delivery", label: "Delivery" },
  { value: "pickup",   label: "Pickup"   },
  { value: "dine-in",  label: "Dine In"  },
];

export const PAYMENT_METHODS = [
  { value: "cash",      label: "Cash on Delivery", icon: "💵" },
  { value: "card",      label: "Credit / Debit Card", icon: "💳" },
  { value: "jazzcash",  label: "JazzCash",  icon: "🟠" },
  { value: "easypaisa", label: "EasyPaisa", icon: "🟢" },
];

export const ORDER_STATUSES = [
  { value: "pending",           label: "Pending",           color: "#F59E0B" },
  { value: "confirmed",         label: "Confirmed",         color: "#3B82F6" },
  { value: "preparing",         label: "Preparing",         color: "#8B5CF6" },
  { value: "ready",             label: "Ready",             color: "#06B6D4" },
  { value: "out-for-delivery",  label: "Out for Delivery",  color: "#F97316" },
  { value: "completed",         label: "Completed",         color: "#22C55E" },
  { value: "cancelled",         label: "Cancelled",         color: "#EF4444" },
];

// ─── MENU ────────────────────────────────────────────────────────────────────
export const DIETARY_TAGS = [
  { value: "vegetarian", label: "Vegetarian" },
  { value: "vegan",      label: "Vegan"      },
  { value: "gluten-free", label: "Gluten Free" },
  { value: "spicy",      label: "Spicy"      },
  { value: "halal",      label: "Halal"      },
  { value: "nut-free",   label: "Nut Free"   },
];

export const SORT_OPTIONS = [
  { value: "default",    label: "Default"      },
  { value: "price-asc",  label: "Price: Low → High" },
  { value: "price-desc", label: "Price: High → Low" },
  { value: "name-asc",   label: "Name: A → Z"  },
];

// ─── DESIGN ──────────────────────────────────────────────────────────────────
export const COLORS = {
  primary:     "#E85D04",
  primaryDark: "#C44D02",
  black:       "#0A0A0A",
  darkGray:    "#111111",
  cardBg:      "#1A1A1A",
  border:      "#2A2A2A",
  textPrimary: "#FFFFFF",
  textMuted:   "#9CA3AF",
  success:     "#22C55E",
  error:       "#EF4444",
  warning:     "#F59E0B",
};

// ─── NAVIGATION ──────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Home",    path: "/"        },
  { label: "Menu",    path: "/menu"    },
  { label: "About",   path: "/about"   },
  { label: "Contact", path: "/contact" },
];

export const ADMIN_NAV_LINKS = [
  { label: "Dashboard",  path: "/admin",              icon: "LayoutDashboard" },
  { label: "Menu",       path: "/admin/menu",         icon: "UtensilsCrossed" },
  { label: "Categories", path: "/admin/categories",   icon: "Tag"             },
  { label: "Orders",     path: "/admin/orders",       icon: "ShoppingBag"     },
  { label: "Coupons",    path: "/admin/coupons",      icon: "Ticket"          },
  { label: "Users",      path: "/admin/users",        icon: "Users"           },
];

// ─── PAGINATION ───────────────────────────────────────────────────────────────
export const DEFAULT_PAGE_SIZE = 10;

// ─── TAX ─────────────────────────────────────────────────────────────────────
export const TAX_RATE = 0.05; // 5% GST

// ─── RESTAURANT INFO ──────────────────────────────────────────────────────────
export const RESTAURANT_INFO = {
  name:    "Sibzer",
  tagline: "Where Every Bite Tells a Story",
  phone:   "+92 300 0000000",
  email:   "hello@sibzer.com",
  address: "Karachi, Pakistan",
  hours: {
    weekdays: "12:00 PM – 11:00 PM",
    weekends: "11:00 AM – 12:00 AM",
  },
  social: {
    instagram: "https://instagram.com/sibzer",
    facebook:  "https://facebook.com/sibzer",
  },
};