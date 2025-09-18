// src/screens/FavoritesScreen.tsx
import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { useMusic } from "./MusicContext";
import { useNavigation } from "@react-navigation/native";

export default function FavoritesScreen() {
  const { favorites, playSong } = useMusic();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>❤️ Favoritas</Text>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.song}
            onPress={() => {
              playSong(item);
              navigation.navigate("Player" as never);
            }}
          >
            <Text style={styles.text}>{item.title} — {item.artist}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  song: { padding: 12, backgroundColor: "#eee", marginBottom: 10, borderRadius: 8 },
  text: { fontSize: 18 },
});
