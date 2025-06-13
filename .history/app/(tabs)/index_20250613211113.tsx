import { FavoriteArtistsSection } from '@/components/FavoriteArtistsSection';
import { MostPlayedAlbumsSection } from '@/components/MostPlayedAlbumsSection';
import { RandomAlbumsSection } from '@/components/RandomAlbumsSection';
import { RecentlyAddedAlbumsSection } from '@/components/RecentlyAddedAlbumsSection';
import { useApiQuery } from '@/hooks/useApiService';
import { homeSchema, type HomeData } from '@/schemas/home';
import { ScrollView, StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { data, isLoading, error } = useApiQuery<HomeData>(
    '/merchandise/home',
    homeSchema
  );

  if (isLoading) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>Loading...</Text></View>;
  }
  if (error) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>Error: {error.message}</Text></View>;
  }
  if (!data?.payload) {
    return <View style={styles.center}><Text style={{color:'#fff'}}>No data</Text></View>;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 32}}>
      <FavoriteArtistsSection artists={data.payload.favoriteArtists} />
      <RecentlyAddedAlbumsSection albums={data.payload.recentAlbums} />
      <RandomAlbumsSection albums={data.payload.randomAlbums} />
      <MostPlayedAlbumsSection albums={data.payload.mostPlayedAlbums} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 24,
    paddingHorizontal: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#000',
  },
});
