import { Album } from '@/schemas/album';
import { Track } from '@/schemas/track';
import React, { createContext, ReactNode, useContext, useState } from 'react';

interface PlayerContextType {
  tracks: Track[];
  currentTrack: Track | null;
  album: Album | null;
  isOpen: boolean;
  openPlayer: (tracks: Track[], track: Track, album: Album) => void;
  closePlayer: () => void;
  setCurrentTrack: (track: Track) => void;
}

const PlayerContext = createContext<PlayerContextType | undefined>(undefined);

export const PlayerProvider = ({ children }: { children: ReactNode }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [album, setAlbum] = useState<Album | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const openPlayer = (tracks: Track[], track: Track, album: Album) => {
    setTracks(tracks);
    setCurrentTrack(track);
    setAlbum(album);
    setIsOpen(true);
  };

  const closePlayer = () => {
    setIsOpen(false);
  };

  return (
    <PlayerContext.Provider value={{ tracks, currentTrack, album, isOpen, openPlayer, closePlayer, setCurrentTrack }}>
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const context = useContext(PlayerContext);
  if (!context) throw new Error('usePlayer must be used within a PlayerProvider');
  return context;
}; 