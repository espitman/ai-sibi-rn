import { useApiQuery } from '@/hooks/useApiService';
import { Album, AlbumDetailResponseSchema } from '@/schemas/album';
import { Track, TracksResponseSchema } from '@/schemas/track';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HEADER_HEIGHT = 240;
const COVER_SIZE = 100;

export default function AlbumDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const albumId = id ? parseInt(id, 10) : undefined;
  const router = useRouter();

  const { data: albumData, isLoading: albumLoading, error: albumError } = useApiQuery(
   `/admin/album/${albumId}`,
    AlbumDetailResponseSchema
  );
  const { data: tracksData, isLoading: tracksLoading, error: tracksError } = useApiQuery(
    `/admin/album/${albumId}/tracks`,
    TracksResponseSchema
  );

  if (albumLoading || tracksLoading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#fff" /></View>;
  }
  if (albumError || tracksError || !albumData?.payload) {
    return <View style={styles.center}><Text style={{ color: '#fff' }}>Error: {albumError?.message || tracksError?.message || 'Album not found'}</Text></View>;
  }

  const album: Album = albumData.payload;
  const tracks: Track[] = tracksData?.payload || [];

  // Format duration mm:ss
  const formatDuration = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // Total duration
  const totalDuration = tracks.reduce((sum, t) => sum + t.duration, 0);

  return (
    <FlatList
      data={tracks}
      keyExtractor={item => item.id.toString()}
      ListHeaderComponent={
        <>
          <View style={{ height: HEADER_HEIGHT, position: 'relative', justifyContent: 'flex-end' }}>
            <Image source={{ uri: album.cover }} style={styles.headerBg} blurRadius={10} />
            <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark" />
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={28} color="#fff" />
            </TouchableOpacity>
            <View style={styles.headerContent}>
              <Image source={{ uri: album.cover }} style={styles.cover} />
              <Text style={styles.title}>{album.title}</Text>
              <Text style={styles.meta}>{formatDuration(totalDuration)}  •  {album.release_year}</Text>
              <Text style={styles.artist}>{album.artist?.name || ''}</Text>
            </View>
          </View>
          <View style={styles.tracksHeader}>
            <Text style={styles.tracksHeaderText}>Track number</Text>
            <Text style={styles.tracksHeaderText}>{tracks.length} tracks</Text>
          </View>
        </>
      }
      contentContainerStyle={{ paddingBottom: 32, backgroundColor: '#18181b' }}
      renderItem={({ item, index }) => (
        <View style={styles.trackRow}>
          <Text style={styles.trackNumber}>{index + 1}</Text>
          <Text style={styles.trackTitle}>{item.title}</Text>
          <TouchableOpacity>
            <Ionicons name="play-outline" size={22} color="#bdbdbd" />
          </TouchableOpacity>
          <Text style={styles.trackDuration}>{formatDuration(item.duration)}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#18181b',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  backButton: {
    position: 'absolute',
    top: 36,
    left: 16,
    zIndex: 2,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 20,
    padding: 4,
  },
  headerContent: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
    zIndex: 1,
  },
  cover: {
    width: COVER_SIZE,
    height: COVER_SIZE,
    borderRadius: COVER_SIZE / 2,
    borderWidth: 4,
    borderColor: '#fff',
    marginBottom: 12,
    backgroundColor: '#222',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  meta: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
    textAlign: 'center',
  },
  artist: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  tracksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: 'transparent',
  },
  tracksHeaderText: {
    color: '#bdbdbd',
    fontSize: 18,
    fontWeight: '500',
  },
  trackRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#23232a',
    marginHorizontal: 16,
    marginBottom: 8,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  trackNumber: {
    color: '#bdbdbd',
    fontSize: 18,
    width: 28,
    textAlign: 'center',
  },
  trackTitle: {
    color: '#fff',
    fontSize: 17,
    flex: 1,
    marginLeft: 8,
  },
  trackDuration: {
    color: '#bdbdbd',
    fontSize: 15,
    marginLeft: 12,
    width: 48,
    textAlign: 'right',
  },
}); 