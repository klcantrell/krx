import React from 'react';
import { Container } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { fetchCats, fetchFavorites } from '../api';
import { FavoritedItemsContext } from '../context';
import { Cat } from '../types';

import CatsList from '../components/CatsList';
import FavoritesList from '../components/FavoritesList';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const [cats, setCats] = React.useState<Cat[]>([]);
  const { setFavorited } = React.useContext(FavoritedItemsContext);

  React.useEffect(() => {
    const fetchData = async () => {
      const [catsData, favoritesData] = await Promise.all([
        fetchCats(),
        fetchFavorites(),
      ]);
      console.log('favorites', favoritesData);
      setCats(catsData);
      setFavorited(
        favoritesData.map(
          (c) => ({ id: c.id, url: c.image.url, breeds: [] } as Cat)
        )
      );
    };
    fetchData();
  }, []);

  return (
    <Container>
      <NavigationContainer>
        <Tab.Navigator>
          <Tab.Screen name="Cats">{() => <CatsList cats={cats} />}</Tab.Screen>
          <Tab.Screen name="Favorites">
            {() => <FavoritesList cats={cats} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </Container>
  );
};

export default Main;
