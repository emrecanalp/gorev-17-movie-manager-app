import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { useAddMovieMutation } from '../src/services/moviesApi';
import { useRouter } from 'expo-router';

export default function AddMovieScreen() {
  const router = useRouter();
  const [addMovie, { isLoading }] = useAddMovieMutation();

  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [posterUrl, setPosterUrl] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');

  const handleSubmit = async () => {
    if (!title || !year || !genre || !rating || !description || !duration) {
      Alert.alert('Hata', 'Lütfen zorunlu alanları doldurun.');
      return;
    }

    try {
      await addMovie({
        title,
        year: Number(year),
        posterUrl: posterUrl || undefined,
        genre,
        rating: Number(rating),
        description,
        duration: Number(duration),
      }).unwrap();

      Alert.alert('Başarılı', 'Film eklendi.', [
        {
          text: 'Tamam',
          onPress: () => router.back(),
        },
      ]);
    } catch (error) {
      Alert.alert('Hata', 'Film eklenirken bir sorun oluştu.');
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

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#020617', padding: 16 }}>
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600', marginBottom: 12 }}>
        Yeni Film Ekle
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
        placeholder="Tür (ör: Bilim Kurgu)"
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
        disabled={isLoading}
        style={{
          marginTop: 12,
          backgroundColor: '#22c55e',
          paddingVertical: 12,
          borderRadius: 8,
          alignItems: 'center',
          opacity: isLoading ? 0.7 : 1,
        }}
      >
        <Text style={{ color: 'white', fontWeight: '600' }}>
          {isLoading ? 'Kaydediliyor...' : 'Kaydet'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}