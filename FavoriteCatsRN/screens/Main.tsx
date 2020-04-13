import React from 'react';
import { StyleSheet, StatusBar } from 'react-native';
import { Container } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { fetchCats, fetchFavorites } from '../api';
import { FavoritedItemsContext, LoadedCatsContext } from '../context';

import TabLabel from '../components/TabLabel';
import CatsList from '../components/CatsList';
import FavoritesList from '../components/FavoritesList';

const Tab = createBottomTabNavigator();

const Main: React.FC = () => {
  const { cats, setCats } = React.useContext(LoadedCatsContext);
  const { setFavorited } = React.useContext(FavoritedItemsContext);

  React.useEffect(() => {
    const fetchData = async () => {
      const [catsData, favoritesData] = await Promise.all([
        fetchCats(),
        fetchFavorites(),
      ]);
      setCats(
        catsData.map((c) => ({
          imageId: c.id,
          favoritedId: null,
          breeds: [],
          url: c.url,
        }))
      );
      setFavorited(
        favoritesData.map((c) => ({
          imageId: c.image.id,
          favoritedId: c.id,
          url: c.image.url,
          breeds: [],
        }))
      );
    };
    fetchData();
  }, []);

  return (
    <Container>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
              const icon = route.name === 'Cats' ? 'cat' : 'heart-outline';
              const tabColor = focused ? 'deeppink' : color;
              return (
                <TabLabel
                  icon={icon}
                  size={size * 1.2}
                  color={tabColor}
                  label={route.name}
                />
              );
            },
          })}
          tabBarOptions={{
            tabStyle: styles.tabBar,
          }}
        >
          <Tab.Screen name="Cats" options={{ tabBarLabel: '' }}>
            {() => <CatsList cats={cats} />}
          </Tab.Screen>
          <Tab.Screen name="Favorites" options={{ tabBarLabel: '' }}>
            {() => <FavoritesList cats={cats} />}
          </Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
    </Container>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Main;
