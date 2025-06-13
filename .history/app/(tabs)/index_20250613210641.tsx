import { useApiQuery } from '@/hooks/useApiService';
import { homeSchema, type HomeData } from '@/schemas/home';
import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  const { data, isLoading, error } = useApiQuery<HomeData>(
    '/merchandise/home',
    homeSchema
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      {data?.payload && (
        <View>
          <Text style={styles.sectionTitle}>Favorite Artists</Text>
          {data.payload.favoriteArtists.map(artist => (
            <Text key={artist.id}>{artist.name}</Text>
          ))}

          <Text style={styles.sectionTitle}>Recent Albums</Text>
          {data.payload.recentAlbums.map(album => (
            <Text key={album.id}>{album.title} - {album.artist.name}</Text>
          ))}

          <Text style={styles.sectionTitle}>Random Albums</Text>
          {data.payload.randomAlbums.map(album => (
            <Text key={album.id}>{album.title} - {album.artist.name}</Text>
          ))}

          <Text style={styles.sectionTitle}>Most Played Albums</Text>
          {data.payload.mostPlayedAlbums.map(album => (
            <Text key={album.id}>{album.title} - {album.artist.name}</Text>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
});
