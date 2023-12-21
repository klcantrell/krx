import { Instance, SnapshotOut, types } from "mobx-state-tree"
import { api } from "../services/api"
import { MobxEpisode, EpisodeModel } from "./Episode"
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
  favorites: string[]
  favoritesOnly: boolean
  addFavorite: (episode: string) => void
  removeFavorite: (episode: string) => void
  hasFavorite: (episode: string) => boolean
  toggleFavorite: (episode: string) => void
  toggleFavoritesOnly: () => void
}

export const createEpisodeSlice: StateCreator<EpisodeState, [], [], EpisodeState> = (set, get) => ({
  favorites: [],
  favoritesOnly: false,
  addFavorite: (episodeId: string) => {
    set((state) => ({
      favorites: [...state.favorites, episodeId],
    }))
  },
  removeFavorite: (episodeId: string) => {
    set((state) => ({
      favorites: state.favorites.filter((f) => f !== episodeId),
    }))
  },
  hasFavorite: (episodeId: string) => {
    return get().favorites.some((f) => f === episodeId)
  },
  toggleFavorite: (episodeId: string) => {
    if (get().hasFavorite(episodeId)) {
      get().removeFavorite(episodeId)
    } else {
      get().addFavorite(episodeId)
    }
  },
  toggleFavoritesOnly: () => {
    set((state) => ({ favoritesOnly: !state.favoritesOnly }))
  },
})
