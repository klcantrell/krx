import React from 'react';
import { SafeAreaView, FlatList } from 'react-native';

import { Cat } from '../types';
import CatCard from './CatCard';

interface Props {
  cats: Cat[];
}

const CatsList: React.FC<Props> = ({ cats }) => (
  <SafeAreaView>
    <FlatList
      data={cats}
      renderItem={({ item: cat }) => <CatCard cat={cat} />}
      keyExtractor={(cat) => String(cat.imageId)}
    />
  </SafeAreaView>
);

export default CatsList;
