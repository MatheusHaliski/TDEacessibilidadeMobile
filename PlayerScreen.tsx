import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Slider from "@react-native-community/slider";
import { Audio } from "expo-av";
import { Ionicons } from "@expo/vector-icons";
import { useMusic } from "./MusicContext";

export default function PlayerScreen() {
  const { currentSong, toggleFavorite, isFavorite,songs,playNext,playPrevious } = useMusic();
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);

  // Configuração inicial do áudio
  useEffect(() => {
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      staysActiveInBackground: true,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
  }, []);

  // Quando troca a música
  useEffect(() => {
    if (currentSong) {
      loadAndPlay(currentSong.uri);
    }
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [currentSong]);

  const loadAndPlay = async (uri: any) => {
    try {
      if (sound) await sound.unloadAsync();

      const { sound: newSound } = await Audio.Sound.createAsync(uri, { shouldPlay: true });
      setSound(newSound);

      newSound.setOnPlaybackStatusUpdate((status) => {
        if (!status.isLoaded) return;
        if (status.durationMillis) {
          setPosition(status.positionMillis || 0);
          setDuration(status.durationMillis);
          setIsPlaying(status.isPlaying);
        }
        // quando terminar, já vai para a próxima
        if (status.didJustFinish) {
          playNext();
        }
      });
    } catch (error) {
      console.error("Erro ao carregar música:", error);
    }
  };

  const togglePlayPause = async () => {
    if (!sound) return;
    if (isPlaying) {
      await sound.pauseAsync();
    } else {
      await sound.playAsync();
    }
  };

  const [currentIndex, setCurrentIndex] = useState<number>(-1);


  const seek = async (value: number) => {
    if (sound) await sound.setPositionAsync(value);
  };

  const formatTime = (millis: number) => {
    const totalSeconds = Math.floor(millis / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!currentSong) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Nenhuma música selecionada 🎶</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Capa */}
      <Image source={currentSong.cover} style={styles.cover} />

      {/* Infos */}
      <Text style={styles.title}>{currentSong.title}</Text>
      <Text style={styles.artist}>{currentSong.artist}</Text>

      {/* Barra */}
      <Slider
        style={{ width: "90%", height: 40 }}
        minimumValue={0}
        maximumValue={duration}
        value={position}
        minimumTrackTintColor="#ff3366"
        maximumTrackTintColor="#ccc"
        onSlidingComplete={seek}
      />
      <View style={styles.timeRow}>
        <Text>{formatTime(position)}</Text>
        <Text>{formatTime(duration)}</Text>
      </View>

      {/* Controles */}
      <View style={styles.controls}>
        <TouchableOpacity onPress={playPrevious}>
          <Ionicons name="play-skip-back" size={40} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity onPress={togglePlayPause}>
          <Ionicons
            name={isPlaying ? "pause-circle" : "play-circle"}
            size={80}
            color="#ff3366"
          />
        </TouchableOpacity>

        <TouchableOpacity onPress={playNext}>
          <Ionicons name="play-skip-forward" size={40} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Favoritar */}
      <TouchableOpacity onPress={() => toggleFavorite(currentSong)}>
        <Ionicons
          name={isFavorite(currentSong) ? "heart" : "heart-outline"}
          size={40}
          color={isFavorite(currentSong) ? "red" : "gray"}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff" },
  cover: { width: 280, height: 280, borderRadius: 12, marginBottom: 30 },
  title: { fontSize: 26, fontWeight: "bold" },
  artist: { fontSize: 18, color: "gray", marginBottom: 20 },
  controls: { flexDirection: "row", alignItems: "center", marginVertical: 20, gap: 40 },
  timeRow: { flexDirection: "row", justifyContent: "space-between", width: "90%" },
  text: { fontSize: 18 },
});
