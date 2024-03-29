/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { View } from './components/Themed';
import { Colors, Header } from 'react-native/Libraries/NewAppScreen';

import useColorScheme from './hooks/useColorScheme';
import NfcWriteScreen from './screens/NfcWriteScreen';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{ height: '100%' }}>
        <Header />
        <NfcWriteScreen />
      </View>
    </SafeAreaView>
  );
};

export default App;
