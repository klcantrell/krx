import React from 'react';
import { StyleSheet, TextStyle } from 'react-native';
import { requireNativeComponent } from 'react-native';

interface NativeProps {
  text: string;
  style: TextStyle;
}

interface Props {
  children: string;
}

export default (props: Props) => {
  return (
    <MyNativeTextView text={props.children} style={styles.nativeTextView} />
  );
};

const MyNativeTextView = requireNativeComponent<NativeProps>('MyTextView');

const styles = StyleSheet.create({
  nativeTextView: {
    width: '100%',
    height: 50,
  },
});
