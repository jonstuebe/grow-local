import { useState } from "react";
import { LayoutChangeEvent, LayoutRectangle } from "react-native";

export function useLayout(): {
  width: number;
  height: number;
  onLayout: (event: LayoutChangeEvent) => void;
} {
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const onLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout({ width, height });
  };

  return { ...layout, onLayout };
}
