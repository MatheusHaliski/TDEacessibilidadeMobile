import React, { createContext, useContext, useState } from "react";

export type Song = {
  id: string;
  title: string;
  artist: string;
  uri: any;   // pode ser require(...) ou link remoto
  cover: any; // idem
};

type MusicContextType = {
  songs: Song[];
  currentSong: Song | null;
  currentIndex: number;
  favorites: Song[];
  playSong: (song: Song) => void;
  playNext: () => void;
  playPrevious: () => void;
  toggleFavorite: (song: Song) => void;
  isFavorite: (song: Song) => boolean;
};

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [favorites, setFavorites] = useState<Song[]>([]);

  // Exemplo de biblioteca de músicas
const songs: Song[] = [
  {
    id: "1",
    title: "Disease",
    artist: "Lady Gaga",
    uri: require("./assets/Disease.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "2",
    title: "Abracadabra",
    artist: "Lady Gaga",
    uri: require("./assets/Abracadabra.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "3",
    title: "Garden Of Eden",
    artist: "Lady Gaga",
    uri: require("./assets/Garden Of Eden.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "4",
    title: "Perfect Celebrity",
    artist: "Lady Gaga",
    uri: require("./assets/Perfect Celebrity.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "5",
    title: "Cant Stop the High",
    artist: "Lady Gaga",
    uri: require("./assets/Cant Stop the High.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "6",
    title: "Vanish Into You",
    artist: "Lady Gaga",
    uri: require("./assets/Vanish Into You.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "7",
    title: "Killah",
    artist: "Lady Gaga & Gesaffelstein",
    uri: require("./assets/Killah.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "8",
    title: "Zombieboy",
    artist: "Lady Gaga",
    uri: require("./assets/Zombieboy.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
  {
    id: "16",
    title: "Shadow Of A Man",
    artist: "Lady Gaga",
    uri: require("./assets/Shadow Of A Man.m4a"),
    cover: require("./assets/mayhem.jpeg"),
  },
];



  const currentSong = currentIndex >= 0 ? songs[currentIndex] : null;

  const playSong = (song: Song) => {
    const index = songs.findIndex((s) => s.id === song.id);
    if (index !== -1) setCurrentIndex(index);
  };

  const playNext = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev + 1) % songs.length);
  };

  const playPrevious = () => {
    if (songs.length === 0) return;
    setCurrentIndex((prev) => (prev - 1 + songs.length) % songs.length);
  };

  const toggleFavorite = (song: Song) => {
    if (favorites.find((s) => s.id === song.id)) {
      setFavorites(favorites.filter((s) => s.id !== song.id));
    } else {
      setFavorites([...favorites, song]);
    }
  };

  const isFavorite = (song: Song) => {
    return favorites.some((s) => s.id === song.id);
  };

  return (
   <MusicContext.Provider
  value={{
    songs,
    currentSong,
    currentIndex,
    favorites,
    playSong,
    playNext,
    playPrevious,
    toggleFavorite,
    isFavorite,
  }}
>
  {children}
</MusicContext.Provider>

  );
};

export const useMusic = () => {
  const ctx = useContext(MusicContext);
  if (!ctx) throw new Error("useMusic deve ser usado dentro de MusicProvider");
  return ctx;
};
