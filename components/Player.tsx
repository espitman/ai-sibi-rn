import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { usePlayer } from './PlayerContext';

const PLAYER_HEIGHT = 110;

export default function Player() {
  const { isOpen, currentTrack, tracks, album, closePlayer } = usePlayer();
  const [progress, setProgress] = useState(0); // seconds
  const [duration, setDuration] = useState(currentTrack?.duration || 0);
  const translateY = useRef(new Animated.Value(PLAYER_HEIGHT)).current;
  const [sliderWidth, setSliderWidth] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (isOpen) {
      Animated.timing(translateY, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
      setProgress(0);
      setDuration(currentTrack?.duration || 0);
    } else {
      Animated.timing(translateY, {
        toValue: PLAYER_HEIGHT,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }
  }, [isOpen, currentTrack]);

  // Fake progress for demo (replace with real audio logic)
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isOpen && duration > 0) {
      interval = setInterval(() => {
        setProgress((p) => {
          if (p < duration) return p + 1;
          else return duration;
        });
      }, 1000);
    }
    return () => { if (interval) clearInterval(interval); };
  }, [isOpen, duration]);

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
        <TouchableOpacity style={styles.playPauseBtn} onPress={() => setIsPlaying(!isPlaying)}>
          <Ionicons name={isPlaying ? 'pause' : 'play'} size={26} color="#fff" />
        </TouchableOpacity>
      </View>
      <View style={styles.bottomRow}>
        <Text style={styles.time}>{formatTime(progress)}</Text>
        <View
          style={styles.sliderTrack}
          onLayout={e => setSliderWidth(e.nativeEvent.layout.width)}
        >
          <View style={[styles.sliderFill, { width: sliderWidth * (progress/duration || 0) }]} />
          <View style={[styles.sliderThumb, { left: Math.max(0, sliderWidth * (progress/duration || 0) - 8) }]} />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
        <TouchableOpacity style={styles.nextBtn}>
          <Ionicons name="play-skip-forward" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 8,
    right: 8,
    bottom: 8,
    height: PLAYER_HEIGHT,
    backgroundColor: '#181818',
    borderRadius: 16,
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
    fontSize: 15,
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
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#23232a',
    borderRadius: 3,
    marginHorizontal: 6,
    overflow: 'visible',
    justifyContent: 'center',
  },
  sliderFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 6,
    backgroundColor: '#fff',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
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