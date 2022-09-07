import React from 'react';
import { TextStyle } from 'react-native';
import { requireNativeComponent } from 'react-native';

interface NativeProps {
  title: string;
  style?: TextStyle;
}

interface Props {
  children: string;
  style?: TextStyle;
}

export default (props: Props) => {
  return <MyNativeTextView title={props.children} style={props.style} />;
};

const MyNativeTextView = requireNativeComponent<NativeProps>('MyTextView');
