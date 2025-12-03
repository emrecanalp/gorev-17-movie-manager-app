import { Stack } from 'expo-router';
import { Provider } from 'react-redux';
import { store, persistor } from '../src/store';
import { PersistGate } from 'redux-persist/integration/react';
import { ActivityIndicator, View } from 'react-native';

export default function RootLayout() {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator />
          </View>
        }
        persistor={persistor}
      >
        <Stack screenOptions={{ headerTitleAlign: 'center' }}>
          <Stack.Screen name="index" options={{ title: 'Filmler' }} />
          <Stack.Screen name="add" options={{ title: 'Film Ekle' }} />
          <Stack.Screen name="edit/[id]" options={{ title: 'Film Güncelle' }} />
        </Stack>
      </PersistGate>
    </Provider>
  );
}