import { useRef, useCallback } from "react";
import { FlatList } from "react-native";

export const useFlatListScroll = () => {
  const flatListRef = useRef<FlatList>(null);

  const scrollToIndex = useCallback(
    (index: number, animated: boolean = true) => {
      if (flatListRef.current) {
        try {
          flatListRef.current.scrollToIndex({
            index,
            animated,
          });
        } catch (error) {
          console.warn("ScrollToIndex failed:", error);
        }
      }
    },
    []
  );

  const scrollToOffset = useCallback(
    (offset: number, animated: boolean = false) => {
      if (flatListRef.current) {
        flatListRef.current.scrollToOffset({ offset, animated });
      }
    },
    []
  );

  const resetScroll = useCallback(() => {
    scrollToOffset(0, false);
  }, [scrollToOffset]);

  return {
    flatListRef,
    scrollToIndex,
    scrollToOffset,
    resetScroll,
  };
};
