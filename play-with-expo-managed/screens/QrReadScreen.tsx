import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

import { View, Text } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import {
  AppDispatch,
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../state/store';
import { userLoggedIn, userLoggingIn } from '../state/userSlice';

interface LoginResponse {
  userId: number;
  id: number;
  title: string;
  completed: boolean;
}

function login() {
  const loginDispatch = async (dispatch: AppDispatch) => {
    dispatch(userLoggingIn());
    const response = await fetch(
      'https://jsonplaceholder.typicode.com/todos/1'
    );
    const data = (await response.json()) as LoginResponse;
    dispatch(userLoggedIn({ token: String(data.id) }));
  };
  return loginDispatch;
}

export default function QrReadScreen({
  navigation,
}: RootTabScreenProps<'ReadQr'>) {
  const [cameraPermissionGranted, setCameraPermissionGranted] =
    useState<CameraPermissionStatus>(CameraPermissionStatus.Uninitialized);
  const [readResult, setReadResult] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { token, loggingIn } = useAppSelector((state: RootState) => state.user);

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
      <Button
        title='Login'
        disabled={token != null}
        onPress={() => dispatch(login())}
      />
      {loggingIn && token == null ? <Text>Loggin in...</Text> : null}
      {!loggingIn && token != null ? (
        <Text>You are signed in with token: {token}</Text>
      ) : null}
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
