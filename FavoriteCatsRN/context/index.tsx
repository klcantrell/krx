import React from 'react';
import * as CatApi from '../api';
import { Alert } from 'react-native';
import { Cat } from '../types';

interface FavoriteItems {
  favorited: Cat[];
  addFavorite: (cat: Cat) => void;
  isFavorited: (id: string) => boolean;
  setFavorited: React.Dispatch<React.SetStateAction<Cat[]>>;
}

const FavoritedItemsContext = React.createContext<FavoriteItems>(
  {} as FavoriteItems
);

const isFavorited = (favorited: string[]) => (id: string) => {
  return favorited.includes(id);
};

const addFavorite = (
  favorited: Cat[],
  setFavorited: React.Dispatch<React.SetStateAction<Cat[]>>
) => async (cat: Cat) => {
  setFavorited([...favorited, cat]);
  try {
    const response = await CatApi.addFavorite(cat.id);
    if (!response.id) {
      Alert.alert(
        'Something went wrong saving a favorite. Please try again.',
        JSON.stringify(response)
      );
      setFavorited(favorited);
    }
  } catch (e) {
    Alert.alert('Something went wrong saving a favorite. Please try again.', e);
    setFavorited(favorited);
  }
};

const FavoritedItemsContextProvider: React.FC = ({ children }) => {
  const [favorited, setFavorited] = React.useState<Cat[]>([]);

  return (
    <FavoritedItemsContext.Provider
      value={{
        favorited,
        addFavorite: addFavorite(favorited, setFavorited),
        isFavorited: isFavorited(favorited.map((c) => c.id)),
        setFavorited,
      }}
    >
      {children}
    </FavoritedItemsContext.Provider>
  );
};

export { FavoritedItemsContext, FavoritedItemsContextProvider };
