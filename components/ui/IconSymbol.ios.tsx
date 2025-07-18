import Ionicons from "@expo/vector-icons/Ionicons";
import { ComponentProps } from "react";
import { StyleProp, TextStyle } from "react-native";

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color: string;
  style?: StyleProp<TextStyle>;
}) {
  return <Ionicons color={color} size={size} name={name} style={style} />;
}
