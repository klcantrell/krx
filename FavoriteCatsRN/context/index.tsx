import React from 'react';
import * as CatApi from '../api';
import { Alert } from 'react-native';
import { Cat } from '../types';

interface LoadedCats {
  cats: Cat[];
  setCats: React.Dispatch<React.SetStateAction<Cat[]>>;
}

interface FavoriteCats {
  favorited: Cat[];
  addFavorite: (cat: Cat) => void;
  deleteFavorite: (cat: Cat) => void;
  isFavorited: (cat: Cat) => boolean;
  setFavorited: React.Dispatch<React.SetStateAction<Cat[]>>;
}

const FavoritedItemsContext = React.createContext<FavoriteCats>(
  {} as FavoriteCats
);

const LoadedCatsContext = React.createContext<LoadedCats>({} as LoadedCats);

const isFavorited = (favorited: Cat[]) => (cat: Cat) => {
  return (
    favorited.some(
      (c) => cat.favoritedId && c.favoritedId === cat.favoritedId
    ) || favorited.some((c) => c.imageId === cat.imageId)
  );
};

const addFavorite = (
  cats: Cat[],
  setCats: React.Dispatch<React.SetStateAction<Cat[]>>,
  favorited: Cat[],
  setFavorited: React.Dispatch<React.SetStateAction<Cat[]>>
) => async (cat: Cat) => {
  setFavorited([...favorited, cat]);
  try {
    const response = await CatApi.addFavorite(cat.imageId);
    if (response.id) {
      setFavorited([...favorited, { ...cat, favoritedId: response.id }]);
      setCats(
        cats.map((c) => {
          if (c.imageId === cat.imageId) {
            return { ...c, favoritedId: response.id };
          } else {
            return c;
          }
        })
      );
    } else {
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

const deleteFavorite = (
  favorited: Cat[],
  setFavorited: React.Dispatch<React.SetStateAction<Cat[]>>
) => async (cat: Cat) => {
  setFavorited(favorited.filter((c) => c.favoritedId !== cat.favoritedId));
  try {
    const response = await CatApi.deleteFavorite(cat.favoritedId!);
    if (response.message !== 'SUCCESS') {
      Alert.alert(
        'Something went wrong removing a favorite. Please try again.',
        JSON.stringify(response)
      );
      setFavorited(favorited);
    }
  } catch (e) {
    Alert.alert(
      'Something went wrong removing a favorite. Please try again.',
      e
    );
    setFavorited(favorited);
  }
};

const CatsContextProvider: React.FC = ({ children }) => {
  const [favorited, setFavorited] = React.useState<Cat[]>([]);
  const [cats, setCats] = React.useState<Cat[]>([]);

  return (
    <FavoritedItemsContext.Provider
      value={{
        favorited,
        addFavorite: addFavorite(cats, setCats, favorited, setFavorited),
        deleteFavorite: deleteFavorite(favorited, setFavorited),
        isFavorited: isFavorited(favorited),
        setFavorited,
      }}
    >
      <LoadedCatsContext.Provider value={{ cats, setCats }}>
        {children}
      </LoadedCatsContext.Provider>
    </FavoritedItemsContext.Provider>
  );
};

export { FavoritedItemsContext, CatsContextProvider, LoadedCatsContext };
