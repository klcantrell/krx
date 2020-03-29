import React from 'react';
import { Image, Animated } from 'react-native';
import { View, Text, Card } from 'native-base';
import { LinearGradient } from 'expo-linear-gradient';

import { Cat } from '../types';

const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient);

interface Props {
  cat: Cat;
}

const CatCard: React.FC<Props> = ({ cat }) => {
  const [loaded, setLoaded] = React.useState(false);
  const [animatedValue] = React.useState(new Animated.Value(0));
  const animation = Animated.loop(
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 2000,
    })
  );
  animation.start();

  return (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 10,
      }}
    >
      <Card
        style={{
          alignItems: 'center',
          height: 400,
          width: '95%',
          borderTopWidth: 0,
        }}
      >
        {!loaded && (
          <View
            style={{
              borderColor: 'lightgrey',
              backgroundColor: 'lightgrey',
              height: '85%',
              width: '100%',
              position: 'absolute',
              overflow: 'hidden',
            }}
          >
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
                    translateX: animatedValue.interpolate({
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
          key={cat.id}
          onLoadEnd={() => {
            animation.stop();
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
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            paddingHorizontal: '7%',
          }}
        >
          <Text>
            {cat.breeds.length > 0 ? cat.breeds[0].name : 'Unknown breed'}
          </Text>
          <Text>Sup</Text>
        </View>
      </Card>
    </View>
  );
};

export default CatCard;
