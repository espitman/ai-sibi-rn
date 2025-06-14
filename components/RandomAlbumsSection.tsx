import { Album } from '@/schemas/home';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  albums: Album[];
};

export function RandomAlbumsSection({ albums }: Props) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Random albums</Text>
        <Text style={styles.chevron}>{'>'}</Text>
      </View>
      <FlatList
        data={albums}
        horizontal
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.albumCard} onPress={() => router.push(`/album/${item.id}`)}>
            <Image source={{ uri: item.cover }} style={styles.cover} />
            <Text style={styles.albumTitle} numberOfLines={1}>{item.title}</Text>
            <Text style={styles.artistName} numberOfLines={1}>{item.artist.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  chevron: {
    fontSize: 22,
    color: '#fff',
  },
  albumCard: {
    width: 140,
    marginRight: 16,
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
  artistName: {
    color: '#ccc',
    fontSize: 14,
  },
}); 