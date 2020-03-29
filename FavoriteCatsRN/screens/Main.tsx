import React from 'react';
import { FlatList, SafeAreaView } from 'react-native';
import { Container } from 'native-base';

import { CAT_API_KEY } from '../env.json';
import CatCard from '../components/CatCard';
import { Cat } from '../types';

const Main: React.FC = () => {
  const [cats, setCats] = React.useState<Cat[]>([]);

  React.useEffect(() => {
    const fetchCats = async () => {
      const response = await fetch(
        'https://api.thecatapi.com/v1/images/search?limit=25&page=0',
        {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'x-api-key': CAT_API_KEY,
            'Cache-Control': 'no-cache',
          },
        }
      );
      const cats = (await response.json()) as Cat[];
      setCats(cats);
    };
    fetchCats();
  }, []);

  return (
    <Container>
      <SafeAreaView>
        <FlatList
          data={cats}
          renderItem={({ item: cat }) => <CatCard cat={cat} />}
          keyExtractor={cat => cat.id}
        />
      </SafeAreaView>
    </Container>
  );
};

export default Main;
