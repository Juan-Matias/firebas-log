import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native'; // Asegúrate de importar useNavigation

export default function Home() {
  const [phoneNumber] = useState('(973) 210-343');
  
  const navigation = useNavigation(); // Aquí se obtiene la instancia de navigation

  const handlePressCallIcon = () => {
    console.log(`Llamando al número: ${phoneNumber}`);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSignIn = () => {
    navigation.navigate('signIn'); // Usa la instancia de navigation para navegar
  };

  const handleSignUp = () => {
    navigation.navigate('signUp'); // Usa la instancia de navigation para navegar
  };

  return (
    <View className="flex-1 p-20">
      {/* Icono de Llamada en la parte superior derecha */}
      <View className="flex-row justify-end">
        <TouchableOpacity onPress={handlePressCallIcon}>
          <MaterialIcons name="call" size={28} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Logo */}
      <View className="items-center mt-2 mb-8">
        <Image
          style={{ height: hp(20) }}
          source={require('../assets/Imagenes-new/Logo.png')}
          resizeMode="contain"
        />
      </View>

      {/* Título */}
      <View className="items-center mb-8 px-4">
        <Text className="text-4xl font-bold text-center text-black">
          🎉 La Diversión en Cada Pinta & la Fiesta en Cada Barril 🍺
        </Text>
      </View>

      {/* Botones de Inicio de Sesión y Registro */}
      <View className="flex-row justify-center mb-4">
        <TouchableOpacity
          className="bg-yellow-500 rounded-full px-6 py-3 mr-4"
          onPress={handleSignIn}
        >
          <Text className="text-white text-lg">Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-yellow-500 rounded-full px-6 py-3"
          onPress={handleSignUp}
        >
          <Text className="text-white text-lg">Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Texto de Ingreso como Invitado */}
      <View className="items-center mt-4">
        <TouchableOpacity>
          <Text className="text-gray-500 text-lg">Ingresar como invitado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
