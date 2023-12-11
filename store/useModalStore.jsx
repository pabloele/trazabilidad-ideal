import { create } from "zustand";

const useModalStore = create((set) => ({
  // Definir el estado inicial aquí
  isOpen: false,

  // Funciones para actualizar el estado
  onOpen: () => set((state) => ({ isOpen: true })),
  onClose: () => set((state) => ({ isOpen: false })),
}));

export default useModalStore;
