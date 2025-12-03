import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useGetMovieQuery, useUpdateMovieMutation } from '../../src/services/moviesApi';
import { useEffect, useState } from 'react';

export default function EditMovieScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data, isLoading, isError } = useGetMovieQuery(id!);
  const [updateMovie, { isLoading: isUpdating }] = useUpdateMovieMutation();

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  useEffect(() => {
    if (data) {
      setTitle(data.title);
      setYear(String(data.year));
      setPosterUrl(data.posterUrl || '');
      setGenre(data.genre);
      setRating(String(data.rating));
      setDescription(data.description);
      setDuration(String(data.duration));
    }
  }, [data]);

  const handleSubmit = async () => {
    if (!title || !year || !genre || !rating || !description || !duration) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    try {
      await updateMovie({
        id: id!,
        data: {
          title,
          year: Number(year),
          posterUrl: posterUrl || undefined,
          genre,
          rating: Number(rating),
          description,
          duration: Number(duration),
        },
      }).unwrap();

      Alert.alert('Başarılı', 'Film güncellendi.', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Film güncellenirken bir sorun oluştu.');
    }
  };

  const inputStyle = {
    backgroundColor: '#0f172a',
    color: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 10,
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Film bulunamadı.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Filmi Güncelle
      </Text>

      <TextInput
        placeholder="Film adı"
        placeholderTextColor="#9ca3af"
        value={title}
        onChangeText={setTitle}
        style={inputStyle}
      />

      <TextInput
        placeholder="Yıl"
        placeholderTextColor="#9ca3af"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
        style={inputStyle}
      />

      <TextInput
        placeholder="Görsel URL (zorunlu değil)"
        placeholderTextColor="#9ca3af"
        value={posterUrl}
        onChangeText={setPosterUrl}
        style={inputStyle}
      />

      <TextInput
        placeholder="Tür"
        placeholderTextColor="#9ca3af"
        value={genre}
        onChangeText={setGenre}
        style={inputStyle}
      />

      <TextInput
        placeholder="Puan (0-10)"
        placeholderTextColor="#9ca3af"
        value={rating}
        onChangeText={setRating}
        keyboardType="numeric"
        style={inputStyle}
      />

      <TextInput
        placeholder="Süre (dakika)"
        placeholderTextColor="#9ca3af"
        value={duration}
        onChangeText={setDuration}
        keyboardType="numeric"
        style={inputStyle}
      />

      <TextInput
        placeholder="Açıklama"
        placeholderTextColor="#9ca3af"
        value={description}
        onChangeText={setDescription}
        style={[inputStyle, { height: 100, textAlignVertical: 'top' }]}
        multiline
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={isUpdating}
        style={{
          marginTop: 12,
          backgroundColor: '#3b82f6',
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
          opacity: isUpdating ? 0.7 : 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {isUpdating ? 'Güncelleniyor...' : 'Güncelle'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}