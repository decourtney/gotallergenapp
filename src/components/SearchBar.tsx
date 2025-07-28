import { Dispatch, SetStateAction, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

type Props = {
  setSearchTerm: Dispatch<SetStateAction<string | null>>;
  placeholder?: string;
};

export default function SearchBar({ setSearchTerm, placeholder }: Props) {
  const [text, onChangeText] = useState("");

  // NOTE: This function works when hitting Enter key on the keyboard
  // still need to test mobile keyboard behavior
  // also need to clear search bar when navigate away from this screen
  const handleOnKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Enter") {
      setSearchTerm(text);
      onChangeText(""); // Clear the input after submitting
      return;
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={onChangeText}
        placeholder={placeholder || "Search..."}
        style={styles.input}
        autoCapitalize="none"
        autoCorrect={false}
        clearTextOnFocus={true}
        clearButtonMode="while-editing"
        onKeyPress={handleOnKeyPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  input: {
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 16,
  },
});
