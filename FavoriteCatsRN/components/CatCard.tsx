import React from 'react';
import { Image, Animated, StyleSheet } from 'react-native';
import { View, Card } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { Cat } from '../types';
import { FavoritedItemsContext } from '../context';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);
const AnimatedIcon = Animated.createAnimatedComponent(MaterialCommunityIcons);

interface Props {
  cat: Cat;
}

const createLikeAnimation = (animatedValue: Animated.Value) =>
  Animated.sequence([
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 150,
      useNativeDriver: true,
    }),
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 150,
      useNativeDriver: true,
    }),
  ]);

const CatCard: React.FC<Props> = ({ cat }) => {
  const [loaded, setLoaded] = React.useState(false);

  const { addFavorite, deleteFavorite, isFavorited } = React.useContext(
    FavoritedItemsContext
  );

  const favorited = isFavorited(cat);
  const prevFavorited = React.useRef(favorited);

  const loadingAnimatedValue = React.useRef(new Animated.Value(0));
  const likeAnimatedValue = React.useRef(new Animated.Value(0));
  const loadingAnimation = React.useRef(
    Animated.loop(
      Animated.timing(loadingAnimatedValue.current, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    )
  );
  const likeAnimation = React.useRef(
    createLikeAnimation(likeAnimatedValue.current)
  );

  React.useEffect(() => {
    if (favorited && !prevFavorited.current) {
      likeAnimation.current.start(
        () =>
          (likeAnimation.current = createLikeAnimation(
            likeAnimatedValue.current
          ))
      );
    }
  }, [favorited]);

  loadingAnimation.current.start();

  return (
    <View style={styles.containter}>
      <Card style={styles.card}>
        {!loaded && (
          <View style={styles.loaderContainer}>
            <AnimatedLinearGradient
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              colors={['lightgrey', 'white', 'lightgrey']}
              style={{
                height: '100%',
                width: '100%',
                borderRadius: 10,
                transform: [
                  {
                    translateX: loadingAnimatedValue.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [-400, 400],
                    }),
                  },
                ],
              }}
            />
          </View>
        )}
        <Image
          key={cat.imageId}
          onLoadEnd={() => {
            loadingAnimation.current.stop();
            setLoaded(true);
          }}
          source={{ uri: cat.url }}
          style={{
            opacity: loaded ? 1 : 0,
            height: '85%',
            width: '100%',
            position: 'relative',
          }}
          resizeMode="cover"
        />
        <View style={styles.descriptionContainer}>
          <TouchableWithoutFeedback
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              padding: '7%',
            }}
            onPress={() => {
              if (!favorited) {
                addFavorite(cat);
              } else {
                deleteFavorite(cat);
              }
            }}
          >
            <AnimatedIcon
              name={favorited ? 'heart' : 'heart-outline'}
              color={favorited ? 'red' : 'black'}
              size={28}
              style={{
                transform: [
                  {
                    scale: likeAnimatedValue.current.interpolate({
                      inputRange: [0, 1],
                      outputRange: [1, 1.7],
                    }),
                  },
                ],
              }}
            />
          </TouchableWithoutFeedback>
        </View>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  containter: {
    alignItems: 'center',
    marginBottom: 10,
  },
  card: {
    alignItems: 'center',
    height: 400,
    width: '95%',
    borderTopWidth: 0,
  },
  loaderContainer: {
    borderColor: 'lightgrey',
    backgroundColor: 'lightgrey',
    height: '85%',
    width: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  descriptionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: '7%',
    paddingRight: 0,
  },
});

export default CatCard;
