import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import RangeSlider from 'rn-range-slider';
import { usePlayer } from './PlayerContext';

const PLAYER_HEIGHT = 110;

// Custom components for the slider
const Thumb = () => (
  <View style={styles.sliderThumb} />
);

const Rail = () => (
  <View style={styles.sliderTrack} />
);

const RailSelected = () => (
  <View style={styles.sliderFill} />
);

export default function Player() {
  const { isOpen, currentTrack, tracks, album, closePlayer, setCurrentTrack } = usePlayer();
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(currentTrack?.duration || 0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const translateY = useRef(new Animated.Value(PLAYER_HEIGHT)).current;

  // Slider render functions
  const renderThumb = useCallback(() => <Thumb />, []);
  const renderRail = useCallback(() => <Rail />, []);
  const renderRailSelected = useCallback(() => <RailSelected />, []);

  // Handle slider value change
  const handleValueChange = useCallback(async (low: number) => {
    if (!sound) return;
    try {
      await sound.setPositionAsync(low * 1000);
      setProgress(low);
    } catch (error) {
      console.error('Error seeking:', error);
    }
  }, [sound]);

  // Load and play audio when currentTrack changes
  useEffect(() => {
    let isMounted = true;
    async function loadAndPlay() {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      if (currentTrack?.url) {
        try {
          const { sound: newSound, status } = await Audio.Sound.createAsync(
            { uri: currentTrack.url },
            { shouldPlay: true },
            onPlaybackStatusUpdate
          );
          if (isMounted) {
            setSound(newSound);
            if (status.isLoaded) {
              const newDuration = status.durationMillis ? Math.floor(status.durationMillis / 1000) : currentTrack.duration || 0;
              const newProgress = status.positionMillis ? Math.floor(status.positionMillis / 1000) : 0;
              setDuration(newDuration);
              setProgress(newProgress);
            } else {
              setDuration(currentTrack.duration || 0);
              setProgress(0);
            }
            setIsPlaying(true);
          }
        } catch (error) {
          console.error('Error loading audio:', error);
        }
      }
    }
    if (isOpen && currentTrack) {
      loadAndPlay();
    }
    return () => {
      isMounted = false;
      if (sound) sound.unloadAsync();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrack, isOpen]);

  // Playback status update
  const onPlaybackStatusUpdate = (status: any) => {
    if (!status.isLoaded) return;
    // Type guard for AVPlaybackStatusSuccess
    if (status.isLoaded) {
      const newProgress = status.positionMillis ? Math.floor(status.positionMillis / 1000) : 0;
      const newDuration = status.durationMillis ? Math.floor(status.durationMillis / 1000) : 0;
      setProgress(newProgress);
      setDuration(newDuration);
      if (status.didJustFinish) {
        handleNext();
      }
    }
  };

  // Play/Pause toggle
  const handlePlayPause = async () => {
    if (!sound) return;
    try {
      if (isPlaying) {
        await sound.pauseAsync();
        setIsPlaying(false);
      } else {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  // Next track
  const handleNext = async () => {
    if (!tracks || !currentTrack) return;
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    if (idx >= 0 && idx < tracks.length - 1) {
      setCurrentTrack(tracks[idx + 1]);
    } else {
      // Optionally: close player or loop
      setCurrentTrack(tracks[0]);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (sound) sound.unloadAsync();
      setSound(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen || !currentTrack) return null;

  // Format seconds to mm:ss
  const formatTime = (s: number) => `${Math.floor(s/60)}:${(s%60).toString().padStart(2,'0')}`;

  // Use album for cover and artist
  const cover = album?.cover || 'https://via.placeholder.com/56x56?text=Music';
  const artist = album?.artist?.name || '';

  return (
    <Animated.View style={[styles.container, { transform: [{ translateY }] }]}>  
      <View style={styles.topRow}>
        <Image source={{ uri: cover }} style={styles.cover} />
        <View style={styles.infoCol}>
          <Text style={styles.title} numberOfLines={1}>{currentTrack.title}</Text>
          <Text style={styles.artist} numberOfLines={1}>{artist}</Text>
        </View>
        <TouchableOpacity style={styles.playPauseBtn} onPress={handlePlayPause}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.time}>{formatTime(progress)}</Text>
        <View style={styles.sliderContainer}>
          <RangeSlider
            style={styles.slider}
            min={0}
            max={duration}
            step={1}
            low={progress}
            disableRange
            renderThumb={renderThumb}
            renderRail={renderRail}
            renderRailSelected={renderRailSelected}
            onSliderTouchEnd={handleValueChange}
          />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
        <TouchableOpacity style={styles.nextBtn} onPress={handleNext}>
          <Ionicons name="play-skip-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: PLAYER_HEIGHT,
    height: PLAYER_HEIGHT,
    backgroundColor: '#181818',
    borderRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 100,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    justifyContent: 'center',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  cover: {
    width: 56,
    height: 56,
    borderRadius: 10,
    backgroundColor: '#333',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  artist: {
    color: '#bdbdbd',
    fontSize: 14,
    marginBottom: 0,
  },
  playPauseBtn: {
    marginLeft: 8,
    padding: 4,
    alignSelf: 'flex-start',
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  time: {
    color: '#bdbdbd',
    fontSize: 13,
    width: 38,
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    height: 20,
    marginHorizontal: 6,
    justifyContent: 'center',
    marginTop: 5,
  },
  slider: {
    width: '100%',
    height: 20,
  },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#23232a',
    borderRadius: 3,
  },
  sliderFill: {
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  sliderThumb: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#181818',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  nextBtn: {
    marginLeft: 8,
    padding: 4,
  },
}); 