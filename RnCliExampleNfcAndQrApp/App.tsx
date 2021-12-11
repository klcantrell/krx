/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React, { useEffect } from 'react';
import { Alert, StatusBar } from 'react-native';
import dynamicLinks, {
  FirebaseDynamicLinksTypes,
} from '@react-native-firebase/dynamic-links';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import useColorScheme from './hooks/useColorScheme';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from './navigation';

type InitialLink = FirebaseDynamicLinksTypes.DynamicLink | null;

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const handleDynamicLink = (link: InitialLink) => {
    if (link?.url.includes('https://kalalau.page.link')) {
      Alert.alert('Welcome! A deep link has taken you here.');
    }
  };

  useEffect(() => {
    dynamicLinks().getInitialLink().then(handleDynamicLink);
  });

  return (
    <SafeAreaProvider style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Navigation colorScheme={isDarkMode ? 'dark' : 'light'} />
    </SafeAreaProvider>
  );
};

export default App;
