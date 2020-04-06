import React from 'react';

interface FavoriteItems {
  favorited: string[];
  setFavorited: any;
}

const FavoritedItemsContext = React.createContext<FavoriteItems>(
  {} as FavoriteItems
);

const FavoritedItemsContextProvider: React.FC = ({ children }) => {
  const [favorited, setFavorited] = React.useState<string[]>([]);

  return (
    <FavoritedItemsContext.Provider value={{ favorited, setFavorited }}>
      {children}
    </FavoritedItemsContext.Provider>
  );
};

export { FavoritedItemsContext, FavoritedItemsContextProvider };
