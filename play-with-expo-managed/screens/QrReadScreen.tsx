import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { View, Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function QrReadScreen({
  navigation,
}: RootTabScreenProps<'ReadQr'>) {
  const [cameraPermissionGranted, setCameraPermissionGranted] =
    useState<CameraPermissionStatus>(CameraPermissionStatus.Uninitialized);
  const [readResult, setReadResult] = useState<string | null>(null);

  useEffect(() => {
    async function requestCameraPermission() {
      try {
        const { status } = await BarCodeScanner.requestPermissionsAsync();
        setCameraPermissionGranted(
          status === 'granted'
            ? CameraPermissionStatus.Granted
            : CameraPermissionStatus.NotGranted
        );
      } catch (error) {
        setCameraPermissionGranted(CameraPermissionStatus.NotGranted);
      }
    }
    requestCameraPermission();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Read QR code test</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      {cameraPermissionGranted === CameraPermissionStatus.Granted ? (
        <View></View>
      ) : (
        <Text>Something went wrong acquiring camera permissions</Text>
      )}
      {readResult ? (
        <View style={styles.resultContainer}>
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          <Text>Message received:</Text>
          <Text>{readResult}</Text>
        </View>
      ) : null}
    </View>
  );
}

enum CameraPermissionStatus {
  Uninitialized,
  Granted,
  NotGranted,
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 2,
    width: '80%',
  },
  statusText: {
    marginVertical: 10,
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
});
