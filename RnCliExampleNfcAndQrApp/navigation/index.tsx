import React from 'react';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import { Colors } from 'react-native/Libraries/NewAppScreen';

import NfcWriteScreen from '../screens/NfcWriteScreen';
import { RootTabParamList } from '../types';
import linking from './LinkingConfiguration';
import QrReadScreen from '../screens/QrReadScreen';
import useColorScheme from '../hooks/useColorScheme';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

interface Props {
  colorScheme: string;
}

export default function Navigation({ colorScheme }: Props) {
  return (
    <NavigationContainer
      linking={linking}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <RootNavigator />
    </NavigationContainer>
  );
}

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

function RootNavigator() {
  const colorScheme = useColorScheme();

  return (
    <BottomTab.Navigator
      initialRouteName='WriteNfc'
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme].tint,
      }}>
      <BottomTab.Screen
        name='WriteNfc'
        component={NfcWriteScreen}
        options={{
          title: 'Write NFC',
        }}
      />
      <BottomTab.Screen
        name='ReadQr'
        component={QrReadScreen}
        options={{
          title: 'Read QR code',
        }}
      />
    </BottomTab.Navigator>
  );
}
