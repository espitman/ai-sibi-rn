import { Artist } from '@/schemas/home';
import { BlurView } from 'expo-blur';
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
          <TouchableOpacity style={styles.artistCard} onPress={() => router.push({ pathname: '/artist/[id]', params: { id: String(item.id) } })}>
            <Image source={{ uri: item.avatar }} style={styles.bgImage} />
            <BlurView intensity={50} style={StyleSheet.absoluteFill} tint="default" />
            <View style={styles.contentRow}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.artistName} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.artistRole}>Singer</Text>
              </View>
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
    width: 220,
    height: 80,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
    marginBottom: 8,
    position: 'relative',
    justifyContent: 'center',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
    paddingLeft: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#fff',
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