// Fallback for using MaterialIcons on Android and web.

import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight, SymbolViewProps } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  "house.fill": "home",
  "book.fill": "menu-book",
  "chart.bar.fill": "bar-chart",
  "person.fill": "person",
  "target": "track-changes",
  "camera.fill": "camera-alt",
  "pencil": "edit",
  "pencil.circle": "edit",
  "barcode": "qr-code-2",
  "xmark": "close",
  "trash": "delete",
  "photo.fill": "photo-library",
  "info.circle.fill": "info",
  "chevron.left": "chevron-left",
  "chevron.right": "chevron-right",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "globe": "public",
  "sun.max": "wb-sunny",
  "sun.max.fill": "wb-sunny",
  "moon.fill": "nightlight-round",
  "moon.stars": "nights-stay",
  "sunrise.fill": "wb-twilight",
  "star.fill": "star",
  "checkmark.circle.fill": "check-circle",
  "arrow.left": "arrow-back",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: string;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = (MAPPING[name] || "help-outline") as ComponentProps<typeof MaterialIcons>["name"];
  return <MaterialIcons color={color} size={size} name={iconName} style={style} />;
}
