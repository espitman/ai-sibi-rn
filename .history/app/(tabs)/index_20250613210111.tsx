import { useApiQuery } from '@/hooks/useApiService';
import { StyleSheet, Text, View } from 'react-native';
import { z } from 'zod';

// Define the response schema
const MerchandiseSchema = z.object({
  // Add your response fields here based on the API response
  // This is a placeholder schema
  id: z.number(),
  name: z.string(),
  // ... other fields
});

export default function HomeScreen() {
  const { data, isLoading, error } = useApiQuery(
    '/merchandise/home',
    MerchandiseSchema
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
      {data && (
        <View>
          <Text>Merchandise Data:</Text>
          <Text>{JSON.stringify(data, null, 2)}</Text>
        </View>
      )}
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
