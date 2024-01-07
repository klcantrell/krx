import { useEffect, useState } from "react"
import { AuthenticationState, createAuthenticationSlice } from "../AuthenticationStore"
import { EpisodeState, createEpisodeSlice } from "../EpisodeStore"
import { createJSONStorage, persist } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { create } from "zustand"

/**
 * The key we'll be saving our state as within async storage.
 */
export const ROOT_STATE_STORAGE_KEY = "root-v1"

export function useInitializeStores(callback?: () => void | Promise<void>) {
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const alreadyHydrated = useStore.persist.hasHydrated()

    if (alreadyHydrated) {
      setHydrated(true)

      if (callback) {
        callback()
      }
    }

    const unsubscribeFinishHydration = useStore.persist.onFinishHydration(() => {
      setHydrated(true)

      if (callback) {
        callback()
      }
    })

    return () => {
      unsubscribeFinishHydration()
    }
  }, [])

  return { hydrated }
}

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
