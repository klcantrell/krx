import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';

import { FavoritedItemsContext } from '../context';
import { Cat } from '../types';
import CatCard from './CatCard';

interface Props {
  cats: Cat[];
}

const FavoritesList: React.FC<Props> = ({ cats }) => {
  const { favorited } = React.useContext(FavoritedItemsContext);

  return (
    <SafeAreaView>
      <FlatList
        data={cats.filter((c) => favorited.includes(c.id))}
        renderItem={({ item: cat }) => <CatCard cat={cat} />}
        keyExtractor={(cat) => cat.id}
      />
    </SafeAreaView>
  );
};

export default FavoritesList;
