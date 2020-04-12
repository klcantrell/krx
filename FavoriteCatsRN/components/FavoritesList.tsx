import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';

import { FavoritedItemsContext } from '../context';
import { Cat } from '../types';
import CatCard from './CatCard';

interface Props {
  cats: Cat[];
}

const FavoritesList: React.FC<Props> = () => {
  const { favorited } = React.useContext(FavoritedItemsContext);

  return (
    <SafeAreaView>
      <FlatList
        data={favorited}
        renderItem={({ item: cat }) => <CatCard cat={cat} />}
        keyExtractor={(cat) => String(cat.favoritedId)}
      />
    </SafeAreaView>
  );
};

export default FavoritesList;
