import React, { useEffect, useState } from 'react';
import { Button, StyleSheet } from 'react-native';
import NfcManager, {
  NfcEvents,
  Ndef,
  TagEvent,
} from 'react-native-nfc-manager';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

export default function TabOneScreen({
  navigation,
}: RootTabScreenProps<'TabOne'>) {
  const [nfcStatus, setNfcStatus] = useState(NfcStatus.Unintialized);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    async function initializeNfc() {
      try {
        const isSupported = await NfcManager.isSupported();
        if (isSupported) {
          await NfcManager.start();
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
        title='Scan'
        onPress={() => readNdef(setScanResult)}
      />
      {scanResult ? (
        <View style={styles.resultContainer}>
          <View
            style={styles.separator}
            lightColor='#eee'
            darkColor='rgba(255,255,255,0.1)'
          />
          <Text>Message received:</Text>
          <Text>{scanResult}</Text>
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
      return 'NFC functionality is available! Please press the button below to start scanning for a tag';
    case NfcStatus.FailedToInitialize:
      return 'Something went wrong initializing NFC functionality';
    case NfcStatus.Unsupported:
      return 'NFC functionality does not seem supported on your device';
    case NfcStatus.Unintialized:
    default:
      return 'NFC functionality has not been initialized';
    case NfcStatus.Unintialized:
  }
}
enum NfcStatus {
  Unintialized,
  Initialized,
  FailedToInitialize,
  Unsupported,
}

function readNdef(onScanFinished: (result: string) => void) {
  const cleanUp = () => {
    NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
    NfcManager.setEventListener(NfcEvents.SessionClosed, null);
  };

  let tagMessage: string | null = null;

  NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag: TagEvent) => {
    tagMessage =
      Ndef.text.decodePayload(
        tag.ndefMessage[0]?.payload as unknown as Uint8Array
      ) ?? null;
    onScanFinished(tagMessage);
    NfcManager.setAlertMessageIOS('NDEF tag found');
    NfcManager.unregisterTagEvent().catch(() => 0);
  });

  NfcManager.setEventListener(NfcEvents.SessionClosed, () => {
    cleanUp();
    if (tagMessage == null) {
      onScanFinished('Could not extract payload from NFC tag');
    }
  });

  NfcManager.registerTagEvent();
}
