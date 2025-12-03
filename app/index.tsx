import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, TextInput, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useGetMoviesQuery, useDeleteMovieMutation, Movie } from '../src/services/moviesApi';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { setSearchTerm } from '../src/store/moviesSlice';

export default function HomeScreen() {
  const router = useRouter();
  const { data, isLoading, isError } = useGetMoviesQuery();
  const [deleteMovie, { isLoading: isDeleting }] = useDeleteMovieMutation();
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector((state) => state.movies.searchTerm);

  const filteredMovies =
    data?.filter((movie) =>
      movie.title.toLowerCase().includes(searchTerm.toLowerCase().trim())
    ) || [];

  const handleDelete = async (id: number | string) => {
    try {
      await deleteMovie(id).unwrap();
    } catch (error) {
      console.log('Silme hatası:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Filmler yüklenirken bir hata oluştu.</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: Movie }) => (
    <View
      style={{
        backgroundColor: '#1e293b',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
      }}
    >
      {item.posterUrl ? (
        <Image
          source={{ uri: item.posterUrl }}
          style={{ width: 70, height: 100, borderRadius: 6 }}
        />
      ) : (
        <View
          style={{
            width: 70,
            height: 100,
            borderRadius: 6,
            backgroundColor: '#0f172a',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontSize: 12 }}>Görsel yok</Text>
        </View>
      )}

      <View style={{ flex: 1 }}>
        <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>{item.title}</Text>
        <Text style={{ color: '#cbd5f5', marginTop: 2 }}>
          {item.year} • {item.genre}
        </Text>
        <Text style={{ color: '#eab308', marginTop: 2 }}>Puan: {item.rating}</Text>
        <Text
          style={{ color: '#e5e7eb', marginTop: 4 }}
          numberOfLines={2}
        >
          {item.description}
        </Text>

        <View style={{ flexDirection: 'row', marginTop: 8, gap: 8 }}>
          <TouchableOpacity
            onPress={() => router.push(`/edit/${item.id}`)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: '#3b82f6',
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>Düzenle</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleDelete(item.id!)}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 6,
              borderRadius: 6,
              backgroundColor: '#ef4444',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            <Text style={{ color: 'white', fontWeight: '500' }}>Sil</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput
          placeholder="Film ara..."
          placeholderTextColor="#9ca3af"
          value={searchTerm}
          onChangeText={(text) => dispatch(setSearchTerm(text))}
          style={{
            flex: 1,
            backgroundColor: '#0f172a',
            borderRadius: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            color: 'white',
          }}
        />

        <TouchableOpacity
          onPress={() => router.push('/add')}
          style={{
            backgroundColor: '#22c55e',
            borderRadius: 8,
            paddingHorizontal: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '600' }}>+ Ekle</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredMovies}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
      />
    </View>
  );
}