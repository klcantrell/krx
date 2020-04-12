import 'react-native-gesture-handler';
import React from 'react';
import { AppLoading } from 'expo';
import { loadAsync as loadExpoFont } from 'expo-font';
import { Ionicons } from '@expo/vector-icons';

import { CatsContextProvider } from './context';
import Main from './screens/Main';

const App: React.FC = () => {
  const [fontsLoaded, setFontsLoaded] = React.useState(false);

  React.useEffect(() => {
    const loadFonts = async () => {
      await loadExpoFont({
        Roboto: require('native-base/Fonts/Roboto.ttf'),
        Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),
        ...Ionicons.font,
      });
    };
    loadFonts();
    setFontsLoaded(true);
  }, []);

  return fontsLoaded ? (
    <CatsContextProvider>
      <Main />
    </CatsContextProvider>
  ) : (
    <AppLoading />
  );
};

export default App;
