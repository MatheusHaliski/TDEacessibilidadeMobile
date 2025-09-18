import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text } from "react-native";
import PlayerScreen from "./PlayerScreen";
import LibraryScreen from "./LibraryScreen";
import FavoritesScreen from "./FavoritesScreen";
import { MusicProvider } from "./MusicContext";

function Player() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>🎶 Tela Player</Text>
    </View>
  );
}

function Library() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>📚 Biblioteca</Text>
    </View>
  );
}

function Favorites() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>❤️ Favoritas</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <MusicProvider>
      <NavigationContainer>
        <Tab.Navigator
        id={undefined}
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName: keyof typeof Ionicons.glyphMap = "musical-notes";
              if (route.name === "Player") iconName = "play-circle";
              else if (route.name === "Library") iconName = "albums";
              else if (route.name === "Favorites") iconName = "heart";

              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#ff3366",
            tabBarInactiveTintColor: "gray",
            headerShown: false,
          })}
        >
          <Tab.Screen name="Library" component={LibraryScreen} />
          <Tab.Screen name="Player" component={PlayerScreen} />
          <Tab.Screen name="Favorites" component={FavoritesScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </MusicProvider>
  );
}
