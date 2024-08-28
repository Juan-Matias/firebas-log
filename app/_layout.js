import { View, ActivityIndicator } from "react-native";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cambiamos el estado loading a false una vez que isAuthenticated tiene un valor definido
    if (typeof isAuthenticated !== 'undefined') {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    // Si seguimos en el estado de loading, no hacemos nada
    if (loading) return;

    const inApp = segments[0] === 'app';

    // Manejo de redirección basado en el estado de autenticación
    if (isAuthenticated && !inApp) {
      router.replace('home');
    } else if (isAuthenticated === false) {
      router.replace('homeScreen');
    }
  }, [isAuthenticated, loading]);

  // Mostrar el ActivityIndicator mientras se verifica el estado de autenticación
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="gray" />
      </View>
    );
  }

  // Renderizar el contenido principal si no está cargando
  return <Slot />;
};

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
