import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { MobxEpisode, EpisodeModel, Episode } from "./Episode"
import { withSetPropAction } from "./helpers/withSetPropAction"
import { StateCreator } from "zustand"

export const EpisodeStoreModel = types
  .model("EpisodeStore")
  .props({
    episodes: types.array(EpisodeModel),
    favorites: types.array(types.reference(EpisodeModel)),
    favoritesOnly: false,
  })
  .actions(withSetPropAction)
  .actions((store) => ({
    async fetchEpisodes() {
      const response = await api.getEpisodes()
      if (response.kind === "ok") {
        store.setProp("episodes", response.episodes)
      } else {
        console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
      }
    },
    addFavorite(episode: MobxEpisode) {
      store.favorites.push(episode)
    },
    removeFavorite(episode: MobxEpisode) {
      store.favorites.remove(episode)
    },
  }))
  .views((store) => ({
    get episodesForList() {
      return store.favoritesOnly ? store.favorites : store.episodes
    },

    hasFavorite(episode: MobxEpisode) {
      return store.favorites.includes(episode)
    },
  }))
  .actions((store) => ({
    toggleFavorite(episode: MobxEpisode) {
      if (store.hasFavorite(episode)) {
        store.removeFavorite(episode)
      } else {
        store.addFavorite(episode)
      }
    },
  }))

export interface EpisodeStore extends Instance<typeof EpisodeStoreModel> {}
export interface EpisodeStoreSnapshot extends SnapshotOut<typeof EpisodeStoreModel> {}

// @demo remove-file

export interface EpisodeState {
  episodes: Episode[]
  favorites: Episode[]
  favoritesOnly: boolean
  fetchEpisodes: () => Promise<void>
  addFavorite: (episode: Episode) => void
  removeFavorite: (episode: Episode) => void
  hasFavorite: (episode: Episode) => boolean
  toggleFavorite: (episode: Episode) => void
  toggleFavoritesOnly: () => void
  computedEpisodeState: {
    episodesForList: Episode[]
  }
}

export const createEpisodeSlice: StateCreator<EpisodeState, [], [], EpisodeState> = (set, get) => ({
  episodes: [],
  favorites: [],
  favoritesOnly: false,
  fetchEpisodes: async () => {
    const response = await api.getEpisodes()
    if (response.kind === "ok") {
      set({ episodes: response.episodes })
    } else {
      console.error(`Error fetching episodes: ${JSON.stringify(response)}`)
    }
  },
  addFavorite: (episode: Episode) => {
    set((state) => ({
      favorites: [...state.favorites, episode],
    }))
  },
  removeFavorite: (episode: Episode) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f.guid !== episode.guid),
    }))
  },
  hasFavorite: (episode: Episode) => {
    return get().favorites.some((f) => f.guid === episode.guid)
  },
  toggleFavorite: (episode: Episode) => {
    if (get().hasFavorite(episode)) {
      get().removeFavorite(episode)
    } else {
      get().addFavorite(episode)
    }
  },
  toggleFavoritesOnly: () => {
    set((state) => ({ favoritesOnly: !state.favoritesOnly }))
  },
  computedEpisodeState: {
    get episodesForList() {
      return get().favoritesOnly ? get().favorites : get().episodes
    },
  },
})
