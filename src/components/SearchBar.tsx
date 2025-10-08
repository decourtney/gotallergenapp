import { Dispatch, SetStateAction, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput,
  TextInputKeyPressEventData,
  View,
} from "react-native";

type Props = {
  setSearchTerm: Dispatch<SetStateAction<string | null>>;
  placeholder?: string;
};

export default function SearchBar({ setSearchTerm, placeholder }: Props) {
  const [text, onChangeText] = useState("");

  const handleSubmit = () => {
    if (text.trim()) {
      setSearchTerm(text.trim());
      onChangeText(""); // Clear the input after submitting
    }
  };

  // Handle Enter key on desktop/keyboard
  const handleOnKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    if (event.nativeEvent.key === "Enter") {
      handleSubmit();
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
        onSubmitEditing={handleSubmit} // Handle mobile keyboard "Search" button
        returnKeyType="search" // Change keyboard button to "Search"
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
