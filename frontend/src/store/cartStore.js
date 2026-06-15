import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (menuItem) => {
        const items = get().items
        const existing = items.find((i) => i._id === menuItem._id)
        if (existing) {
          set({
            items: items.map((i) =>
              i._id === menuItem._id ? { ...i, qty: i.qty + 1 } : i
            ),
          })
        } else {
          set({ items: [...items, { ...menuItem, qty: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i._id !== id) })
      },

      increaseQty: (id) => {
        set({
          items: get().items.map((i) =>
            i._id === id ? { ...i, qty: i.qty + 1 } : i
          ),
        })
      },

      decreaseQty: (id) => {
        const items = get().items
        const item = items.find((i) => i._id === id)
        if (!item) return
        if (item.qty === 1) {
          set({ items: items.filter((i) => i._id !== id) })
        } else {
          set({
            items: items.map((i) =>
              i._id === id ? { ...i, qty: i.qty - 1 } : i
            ),
          })
        }
      },

      clearCart: () => set({ items: [] }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotal: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
      getCount: () => get().items.reduce((sum, i) => sum + i.qty, 0),
    }),
    {
      name: 'sibzer-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)