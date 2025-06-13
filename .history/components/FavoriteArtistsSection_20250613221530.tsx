import { Artist } from '@/schemas/home';
import { useRouter } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  artists: Artist[];
};

export function FavoriteArtistsSection({ artists }: Props) {
  const router = useRouter();
  return (
    <View style={styles.section}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Favorite artists</Text>
        <Text style={styles.chevron}>{'>'}</Text>
      </View>
      <FlatList
        data={artists}
        horizontal
        keyExtractor={item => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.artistCard} onPress={() => router.push(`/artist/${item.id}`)}>
            <Image source={{ uri: item.avatar }} style={styles.avatar} />
            <View>
              <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
              <Text style={styles.artistRole}>Singer</Text>
            </View>
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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  chevron: {
    fontSize: 28,
    color: '#fff',
  },
  artistCard: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginRight: 16,
    minWidth: 220,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
  },
  artistName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    maxWidth: 120,
  },
  artistRole: {
    color: '#ccc',
    fontSize: 14,
  },
}); 