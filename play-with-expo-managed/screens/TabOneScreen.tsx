import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { NfcStatus } from '../models';
import { initializeNfcManager, readTag } from '../nfcManager';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [nfcStatus, setNfcStatus] = useState(NfcStatus.Unintialized);
  const [readResult, setReadResult] = useState<string | null>(null);

  useEffect(() => {
    async function initializeNfc() {
      try {
        const nfcManagerInitialized = await initializeNfcManager();
        if (nfcManagerInitialized) {
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
      <Text style={styles.title}>Read NFC test</Text>
      <View
        style={styles.separator}
        lightColor='#eee'
        darkColor='rgba(255,255,255,0.1)'
      />
      <Text style={styles.statusText}>{getNfcStatusText(nfcStatus)}</Text>
      <Button
        disabled={nfcStatus !== NfcStatus.Initialized}
        title='Read tag'
        onPress={async () => {
          const tagMessage = await readTag();
          setReadResult(tagMessage);
        }}
      />
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

function getNfcStatusText(status: NfcStatus) {
  switch (status) {
    case NfcStatus.Initialized:
      return 'NFC functionality is available! Use the button below to start scanning for a tag.';
    case NfcStatus.FailedToInitialize:
      return 'Something went wrong initializing NFC functionality';
    case NfcStatus.Unintialized:
    default:
      return 'NFC functionality has not been initialized';
  }
}
