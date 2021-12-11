/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import { LinkingOptions } from '@react-navigation/native';

import { RootStackParamList } from '../types';

const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['https://kalalau.page.link'],
  config: {
    screens: {
      Home: {
        screens: {
          WriteNfc: 'writenfc',
          ReadQr: 'readqr',
        },
      },
    },
  },
};

export default linking;
