import { PLAYER_HEIGHT, usePlayer } from '@/components/PlayerContext';
import { StyleSheet, Text, View } from 'react-native';

export default function SettingsScreen() {
  const { isOpen } = usePlayer();
  return (
    <View style={[styles.container, { paddingBottom: isOpen ? PLAYER_HEIGHT : 0 }] }>
      <Text style={styles.title}>Settings</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
}); 