import { View } from "react-native";
import { AuthContextProvider, useAuth } from "../context/authContext";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const MainLayout = () => {
  const { isAuthenticated } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    // Verificar si el usuario está autenticado o no
    if (typeof isAuthenticated === 'undefined') return;
    
    const inApp = segments[0] === 'app';
    
    if (isAuthenticated && !inApp) {
      // Redirigir a la página principal
      router.replace('home');
    } else if (isAuthenticated === false) {
      // Redirigir a la página de inicio de sesión
      router.replace('signIn');
    }
  }, [isAuthenticated]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthContextProvider>
      <MainLayout />
    </AuthContextProvider>
  );
}
