/**
 * @format
 */

import 'react-native';
import React from 'react';
import NfcWriteScreen from '../screens/NfcWriteScreen';

import { render, waitFor } from '@testing-library/react-native';

it('renders correctly', async () => {
  const { getByText } = render(
    <NfcWriteScreen navigation={null} route={null} />
  );
  await waitFor(() => {
    expect(
      getByText(
        'NFC functionality is available! Use the form below to write to your tag.'
      )
    ).toBeDefined();
  });
});
