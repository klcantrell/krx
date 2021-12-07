import React from 'react';
import {requireNativeComponent, TextStyle} from 'react-native';

interface NativeProps {
  text: string;
  style: TextStyle;
}

interface Props {
  children: string;
}

const MyNativeTextView = requireNativeComponent<NativeProps>('MyTextView');

const style: TextStyle = {
  width: '100%',
  height: 50,
};

export default (props: Props) => {
  return <MyNativeTextView text={props.children} style={style} />;
};
