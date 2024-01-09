import { create } from "zustand";

const useAddModalStore = create((set) => ({
  // Definir el estado inicial aquí
  isOpen: false,

  tabActive: 0,

  // Funciones para actualizar el estado
  onOpen: () => set((state) => ({ isOpen: true })),
  onClose: () => set((state) => ({ isOpen: false })),
  setTabActive: (newTabActive) => set((state) => ({ tabActive: newTabActive })),
}));

export default useAddModalStore;
