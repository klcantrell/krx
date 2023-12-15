import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import {
  createAuthenticationSlice,
  AuthenticationState,
  AuthenticationStoreModel,
} from "./AuthenticationStore" // @demo remove-current-line
import { createEpisodeSlice, EpisodeState, EpisodeStoreModel } from "./EpisodeStore" // @demo remove-current-line
import { ROOT_STATE_STORAGE_KEY } from "./helpers/setupRootStore"
import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * A RootStore model.
 */
export const RootStoreModel = types.model("RootStore").props({
  authenticationStore: types.optional(AuthenticationStoreModel, {}), // @demo remove-current-line
  episodeStore: types.optional(EpisodeStoreModel, {}), // @demo remove-current-line
})

/**
 * The RootStore instance.
 */
export interface RootStore extends Instance<typeof RootStoreModel> {}
/**
 * The data of a RootStore.
 */
export interface RootStoreSnapshot extends SnapshotOut<typeof RootStoreModel> {}

export const useStore = create<AuthenticationState & EpisodeState>()(
  persist(
    (set, get, store) => ({
      ...createAuthenticationSlice(set, get, store),
      ...createEpisodeSlice(set, get, store),
    }),
    {
      name: ROOT_STATE_STORAGE_KEY,
      partialize: (state) => {
        // don't persist computed values
        const {
          computedAuthenticationState: _computedAuthenticationState,
          ...rest
        } = state

        return rest
      },
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
