import React, { useState, useEffect } from 'react';
import { Button, TextInput, StyleSheet, Platform } from 'react-native';

import { Text, View } from '../components/Themed';
import { NfcStatus } from '../models';
import {
  getBackgroundTag,
  initializeNfcManager,
  writeTag,
} from '../nfcManager';
import NfcPromptAndroid from '../components/AndroidPrompt';
import useColorScheme from '../hooks/useColorScheme';

export default function NfcWriteScreen() {
  const darkMode = useColorScheme() === 'dark';
  const [nfcStatus, setNfcStatus] = useState(NfcStatus.Unintialized);
  const [scanningForTag, setScanningForTag] = useState(false);
  const [writeResult, setWriteResult] = useState<string | null>(null);
  const [messageToWrite, setMessageToWrite] = useState('');

  useEffect(() => {
    async function initializeNfc() {
      try {
        const nfcManagerInitialized = await initializeNfcManager();
        if (nfcManagerInitialized) {
          const backgroundTag = await getBackgroundTag();
          console.log(backgroundTag?.ndefMessage);
          setNfcStatus(NfcStatus.Initialized);
        } else {
          setNfcStatus(NfcStatus.FailedToInitialize);
        }
      } catch (error) {
        setNfcStatus(NfcStatus.FailedToInitialize);
      }
    }
    initializeNfc();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Write NFC test</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Text style={styles.statusText}>{getNfcStatusText(nfcStatus)}</Text>
      <View style={styles.formContainer}>
        <Text style={styles.textInputLabel}>Message:</Text>
        <TextInput
          style={styles.textInput}
          onChangeText={setMessageToWrite}
          value={messageToWrite}
          placeholder='Your message here...'
          placeholderTextColor={darkMode ? 'gray' : 'darkgray'}
        />
      </View>
      <Button
        disabled={nfcStatus !== NfcStatus.Initialized || scanningForTag}
        title='Write to tag'
        onPress={async () => {
          if (Platform.OS === 'android') {
            setScanningForTag(true);
          }
          const writeResult = await writeTag(messageToWrite);
          if (Platform.OS === 'android') {
            setScanningForTag(false);
          }
          setWriteResult(writeResult);
        }}
      />
      {writeResult ? (
        <View style={styles.resultContainer}>
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          <Text>{writeResult}</Text>
        </View>
      ) : null}
      {scanningForTag ? (
        <NfcPromptAndroid
          show={scanningForTag}
          message='Searching for NFC tag'
          onCancel={() => setScanningForTag(false)}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 30,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  statusText: {
    marginVertical: 10,
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  resultContainer: {
    width: '100%',
    alignItems: 'center',
  },
  formContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingLeft: 20,
  },
  textInputLabel: {
    fontWeight: 'bold',
    marginRight: 10,
    marginVertical: 20,
  },
  textInput: {
    color: '#eee',
  },
});

function getNfcStatusText(status: NfcStatus) {
  switch (status) {
    case NfcStatus.Initialized:
      return 'NFC functionality is available! Use the form below to write to your tag.';
    case NfcStatus.FailedToInitialize:
      return 'Something went wrong initializing NFC functionality';
    case NfcStatus.Unintialized:
    default:
      return 'NFC functionality has not been initialized';
    case NfcStatus.Unintialized:
  }
}
