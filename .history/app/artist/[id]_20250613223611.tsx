import { useApiQuery } from '@/hooks/useApiService';
import { ArtistAlbumsResponseSchema } from '@/schemas/album';
import { ArtistResponseSchema } from '@/schemas/artist';
import { BlurView } from 'expo-blur';
import { useLocalSearchParams } from 'expo-router';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ArtistScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const artistId = id ? parseInt(id, 10) : undefined;

  const { data: artistData, isLoading: artistLoading, error: artistError } = useApiQuery(
    `/admin/artist/${artistId}`,
    ArtistResponseSchema
  );
  const { data: albumsData, isLoading: albumsLoading, error: albumsError } = useApiQuery(
    `/admin/artist/${artistId}/albums`,
    ArtistAlbumsResponseSchema
  );

  if (artistLoading || albumsLoading) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>Loading...</Text></View>;
  }
  if (artistError || albumsError) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>Error loading artist or albums</Text></View>;
  }
  if (!artistData?.payload) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>Artist not found</Text></View>;
  }

  const artist = artistData.payload;
  const albums = albumsData?.payload || [];

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
      <View style={styles.header}>
        <Image source={{ uri: artist.avatar }} style={styles.headerBg} blurRadius={10} />
        <BlurView intensity={60} style={StyleSheet.absoluteFill} tint="dark" />
        <View style={styles.headerContent}>
          <Image source={{ uri: artist.avatar }} style={styles.avatar} />
          <Text style={styles.name}>{artist.name}</Text>
          <Text style={styles.meta}>Albums: {artist.albums_count} | Tracks: {artist.tracks_count}</Text>
          <Text style={styles.meta}>Born: {artist.birth_year}/{artist.birth_month}/{artist.birth_day}</Text>
        </View>
      </View>
      <Text style={styles.sectionTitle}>Albums</Text>
      <View style={styles.albumsRow}>
        {albums.map(album => (
          <View key={album.id} style={styles.albumCard}>
            <Image source={{ uri: album.cover }} style={styles.cover} />
            <Text style={styles.albumTitle} numberOfLines={1}>{album.title}</Text>
            <Text style={styles.albumMeta}>{album.release_year} • {album.genre}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 0,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
  header: {
    height: 240,
    marginBottom: 24,
    justifyContent: 'flex-end',
    position: 'relative',
    overflow: 'hidden',
  },
  headerBg: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContent: {
    alignItems: 'center',
    paddingBottom: 16,
    zIndex: 1,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
    borderWidth: 3,
    borderColor: '#fff',
  },
  name: {
    color: '#fff',
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  meta: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 2,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  albumsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingHorizontal: 16,
  },
  albumCard: {
    width: 140,
    marginRight: 16,
    marginBottom: 16,
  },
  cover: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
  },
  albumTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  albumMeta: {
    color: '#ccc',
    fontSize: 13,
  },
}); 