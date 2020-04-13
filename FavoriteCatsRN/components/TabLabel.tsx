import React from 'react';
import { StyleSheet } from 'react-native';
import { View, Text } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  icon: string;
  color: string;
  size: number;
  label: string;
}

const TabLabel: React.FC<Props> = ({ icon, color, size, label }) => (
  <View style={styles.container}>
    <Text style={[{ color }, styles.text]}>{label}</Text>
    <MaterialCommunityIcons name={icon} color={color} size={size} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    paddingBottom: 3,
    marginRight: 3,
  },
});

export default TabLabel;
