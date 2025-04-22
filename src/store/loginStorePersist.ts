import { create, StateCreator } from "zustand";
import { createJSONStorage, persist, PersistOptions } from "zustand/middleware";

export interface LoginInfo {
  userSeq: number;
  userId: string;
  name: string;
  nickName: string;
  email: string;
  hpNumber: string;
  userRole: string;
}
interface LoginState {
  isLogin: boolean;
  role: string | null;
  loginInfo: LoginInfo | null;
  login: (payload: LoginInfo) => void;
  logout: () => void;
}
export type LoginStatePersist = (
  config: StateCreator<LoginState>,
  options: PersistOptions<LoginState>
) => StateCreator<LoginState>;

export const useLoginStatePersist = create<LoginState>(
  (persist as LoginStatePersist)(
    (set, get) => ({
      isLogin: false,
      role: null,
      loginInfo: null,
      login: (payload: LoginInfo) => {
        const prev = get();
        set({
          isLogin: true,
          role: payload.userRole,
          loginInfo: {
            ...prev.loginInfo,
            ...payload,
          },
        });
      },
      logout: () => {
        set({
          isLogin: false,
          role: null,
          loginInfo: null,
        });
      },
    }),
    {
      name: "loginState",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
