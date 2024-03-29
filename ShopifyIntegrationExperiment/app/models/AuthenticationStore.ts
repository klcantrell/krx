import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { StateCreator } from "zustand"

export const AuthenticationStoreModel = types
  .model("AuthenticationStore")
  .props({
    authToken: types.maybe(types.string),
    authEmail: "",
  })
  .views((store) => ({
    get isAuthenticated() {
      return !!store.authToken
    },
    get validationError() {
      if (store.authEmail.length === 0) return "can't be blank"
      if (store.authEmail.length < 6) return "must be at least 6 characters"
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(store.authEmail))
        return "must be a valid email address"
      return ""
    },
  }))
  .actions((store) => ({
    setAuthToken(value?: string) {
      store.authToken = value
    },
    setAuthEmail(value: string) {
      store.authEmail = value.replace(/ /g, "")
    },
    logout() {
      store.authToken = undefined
      store.authEmail = ""
    },
  }))

export interface AuthenticationStore extends Instance<typeof AuthenticationStoreModel> {}
export interface AuthenticationStoreSnapshot extends SnapshotOut<typeof AuthenticationStoreModel> {}

// @demo remove-file

export interface AuthenticationState {
  authToken?: string
  authEmail: string
  setAuthToken: (value?: string) => void
  setAuthEmail: (value: string) => void
  logout: () => void
  computedAuthenticationState: {
    validationError: string
    isAuthenticated: boolean
  }
}

export const createAuthenticationSlice: StateCreator<
  AuthenticationState,
  [],
  [],
  AuthenticationState
> = (set, get) => ({
  authToken: undefined,
  authEmail: "",
  computedAuthenticationState: {
    get isAuthenticated(): boolean {
      return !!get().authToken
    },
    get validationError(): string {
      if (get().authEmail.length === 0) {
        return "can't be blank"
      }
      if (get().authEmail.length < 6) {
        return "must be at least 6 characters"
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(get().authEmail)) {
        return "must be a valid email address"
      }
      return ""
    },
  },
  setAuthToken: (value?: string) => {
    set({ authToken: value })
  },
  setAuthEmail: (value: string) => {
    set({ authEmail: value.replace(/ /g, "") })
  },
  logout: () => {
    set({ authToken: undefined, authEmail: "" })
  },
})
