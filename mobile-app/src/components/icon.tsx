import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import type { ColorValue } from 'react-native';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

type IconProps = {
  name: IoniconName;
  size?: number;
  color?: ColorValue;
};

export function Icon({ name, size = 22, color = '#201e1d' }: IconProps) {
  return <Ionicons name={name} size={size} color={color} />;
}
