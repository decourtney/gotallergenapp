import { COLORS } from "@/src/constants/theme";
import { Dispatch, SetStateAction, useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  Text,
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
      <View style={styles.searchWrapper}>
        <Text style={styles.iconWrapper}>🔍</Text>
        <TextInput
          value={text}
          onChangeText={onChangeText}
          placeholder={placeholder || "Search..."}
          placeholderTextColor={COLORS.textLight}
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
          clearTextOnFocus={true}
          clearButtonMode="while-editing"
          onKeyPress={handleOnKeyPress}
          onSubmitEditing={handleSubmit}
          returnKeyType="search"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  searchWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.background,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    height: 48,
  },
  iconWrapper: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    height: "100%",
  },
});
