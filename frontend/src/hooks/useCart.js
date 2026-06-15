import { toast } from "react-hot-toast";
import { useCartStore } from "../store/cartStore";

/**
 * useCart — clean interface for cart actions in components
 *
 * Usage:
 *   const { items, totalItems, subtotal, addItem, removeItem } = useCart();
 */
const useCart = () => {
  const {
    items,
    isOpen,
    addItem: storeAddItem,
    removeItem: storeRemoveItem,
    increaseQty,
    decreaseQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,
    getTotalItems,
    getSubtotal,
  } = useCartStore();

  // Add item with toast feedback
  const addItem = (item) => {
    storeAddItem(item);
    toast.success(`${item.name} added to cart`, {
      icon: "🛒",
      style: {
        background: "#1A1A1A",
        color: "#FFFFFF",
        border: "1px solid #2A2A2A",
      },
    });
  };

  // Remove item with toast feedback
  const removeItem = (id, name = "Item") => {
    storeRemoveItem(id);
    toast(`${name} removed from cart`, {
      icon: "🗑️",
      style: {
        background: "#1A1A1A",
        color: "#9CA3AF",
        border: "1px solid #2A2A2A",
      },
    });
  };

  // Check if a specific item is already in cart
  const isInCart = (id) => items.some((i) => i._id === id);

  // Get qty of a specific item in cart
  const getItemQty = (id) => {
    const item = items.find((i) => i._id === id);
    return item ? item.qty : 0;
  };

  return {
    // State
    items,
    isOpen,
    totalItems: getTotalItems(),
    subtotal: getSubtotal(),

    // Actions
    addItem,
    removeItem,
    increaseQty,
    decreaseQty,
    clearCart,
    openCart,
    closeCart,
    toggleCart,

    // Helpers
    isInCart,
    getItemQty,
  };
};

export default useCart;