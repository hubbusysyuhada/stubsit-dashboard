import { create } from 'zustand';

type ToastType = {
  id: string;
  variant: 'success' | 'danger';
  isOpen: boolean;
  text: string;
};

type UseToastType = {
  toast: ToastType | null;
  addToast: (payload: Omit<ToastType, 'isOpen'>) => void;
  removeToast: (id: string) => void;
};

export default create<UseToastType>()((set, get) => ({
  toast: null,
  addToast: (toast) => {
    set({ toast: { ...toast, isOpen: true } });
  },
  removeToast: (id) => {
    const toast = get().toast;
    if (toast && toast.id === id) {
      toast.isOpen = false;
      set({ toast });
      setTimeout(() => {
        set({ toast: null });
      }, 100);
    }
  },
}));
