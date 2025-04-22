import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

interface MenuStoreType {
  showGroupList: string[];
  selectedSubMenu: string;
  appendShowGroup: (groupMenuId: string) => void;
  removeShowGroup: (groupMenuId: string) => void;
  setSelectedSubMenu: (subMenuId: string) => void;
  resetState: () => void;
}

export type MenuStatePersist = (
  config: StateCreator<MenuStoreType>,
  options: PersistOptions<MenuStoreType>
) => StateCreator<MenuStoreType>;

const initialState = {
  selectedSubMenu: "",
  showGroupList: [],
};
export const useMenuStore = create<MenuStoreType>(
  (persist as MenuStatePersist)(
    (set, get) => ({
      ...initialState,
      appendShowGroup: (groupMenuId) => {
        const prev = get();
        set({ ...prev, showGroupList: [...prev.showGroupList, groupMenuId] });
      },
      removeShowGroup: (groupMenuId) => {
        const prev = get();
        set({
          ...prev,
          showGroupList: prev.showGroupList.filter((d) => d != groupMenuId),
        });
      },
      setSelectedSubMenu: (subMenuId) => {
        const prev = get();
        set({
          ...prev,
          selectedSubMenu: subMenuId,
        });
      },
      resetState: () => {
        const prev = get();
        set({ ...prev, ...initialState });
      },
    }),
    {
      name: "memuState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
