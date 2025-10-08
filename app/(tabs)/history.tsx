import {
  clearSearchHistory,
  deleteHistoryItem,
  getSearchHistory,
  SearchHistoryItem,
} from "@/src/utils/storageUtils";
import { useFocusEffect, useNavigation, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";

export default function History() {
  const navigation = useNavigation();
  const router = useRouter();
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Search History",
    });
  }, [navigation]);

  // Load history when screen is focused
  useFocusEffect(
    useCallback(() => {
      loadHistory();
    }, [])
  );

  const loadHistory = async () => {
    const historyData = await getSearchHistory();
    setHistory(historyData);
  };

  const handleClearAll = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to clear all history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: async () => {
            await clearSearchHistory();
            setHistory([]);
          },
        },
      ]
    );
  };

  const handleDeleteItem = async (itemId: string) => {
    const updatedHistory = history.filter((item) => item.id !== itemId);
    setHistory(updatedHistory);
    deleteHistoryItem(itemId);
  };

  const handleItemPress = (item: SearchHistoryItem) => {
    // Navigate to scanner tab with barcode parameter
    if (item.barcode) {
      router.push({
        pathname: "/(tabs)",
        params: { barcode: item.barcode },
      });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteAction}>
      <Text style={styles.deleteActionText}>Delete</Text>
    </TouchableOpacity>
  );

  const renderItem = ({ item }: { item: SearchHistoryItem }) => {
    const hasAllergens = item.allergens.length > 0;

    return (
      <Swipeable
        renderRightActions={renderRightActions}
        onSwipeableOpen={() => handleDeleteItem(item.id)}
      >
        <TouchableOpacity
          style={styles.historyCard}
          onPress={() => handleItemPress(item)}
          activeOpacity={0.7}
        >
          {/* Product Image */}
          {item.imageUrl ? (
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.productImage}
              resizeMode="contain"
            />
          ) : (
            <View style={[styles.productImage, styles.placeholderImage]}>
              <Text style={styles.placeholderText}>?</Text>
            </View>
          )}

          {/* Product Info */}
          <View style={styles.productInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {item.productName}
            </Text>

            {hasAllergens ? (
              <Text style={styles.allergenWarning} numberOfLines={1}>
                Contains: {item.allergens.join(", ")}
              </Text>
            ) : (
              <Text style={styles.allergenSafe}>No allergens detected</Text>
            )}

            <Text style={styles.timestamp}>
              {formatTimestamp(item.timestamp)}
            </Text>
          </View>

          {/* Status Icon */}
          <View style={styles.statusIcon}>
            <Text style={styles.statusEmoji}>{hasAllergens ? "🔴" : "🟢"}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    );
  };

  // Empty state
  if (history.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>No History Yet</Text>
        <Text style={styles.emptySubtitle}>
          Products you scan will appear here
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Clear All Button */}
      <View style={styles.headerBar}>
        <Text style={styles.headerText}>
          {history.length} item{history.length !== 1 ? "s" : ""}
        </Text>
        <TouchableOpacity onPress={handleClearAll}>
          <Text style={styles.clearButton}>Clear All</Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerText: {
    fontSize: 14,
    color: "#666",
  },
  clearButton: {
    fontSize: 14,
    color: "#d32f2f",
    fontWeight: "600",
  },
  listContent: {
    padding: 16,
  },
  historyCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    fontSize: 24,
    color: "#999",
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: "center",
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  allergenWarning: {
    fontSize: 13,
    color: "#d32f2f",
    marginBottom: 4,
  },
  allergenSafe: {
    fontSize: 13,
    color: "#4caf50",
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: "#999",
  },
  statusIcon: {
    marginLeft: 8,
  },
  statusEmoji: {
    fontSize: 24,
  },
  deleteAction: {
    backgroundColor: "#d32f2f",
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: 20,
    marginBottom: 12,
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteActionText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
});
