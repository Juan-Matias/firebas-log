import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Image } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';

export default function Home() {
  const [phoneNumber] = useState('(973) 210-343');
  
  const navigation = useNavigation();

  const handlePressCallIcon = () => {
    console.log(`Llamando al número: ${phoneNumber}`);
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleSignIn = () => {
    navigation.navigate('signIn');
  };

  const handleSignUp = () => {
    navigation.navigate('signUp');
  };

  return (
    <View style={{ paddingTop: hp(5), paddingHorizontal: wp(1) }} className="flex-1">
      {/* Logo y Icono de Llamada */}
      <View className="flex-row justify-between items-center p-4 ">
        {/* Logo */}
        <Image
          style={{ height: hp(20), width: hp(20) }}
          source={require('../assets/Imagenes-new/Logo.png')}
          resizeMode="contain"
        />
        {/* Icono de Llamada */}
        <TouchableOpacity 
          onPress={handlePressCallIcon} 
          style={{ 
            backgroundColor: 'rgba(0, 0, 0, 0.05)', 
            borderRadius: 50, 
            padding: 8 
          }}>
          <MaterialIcons name="call" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Línea debajo del logo e icono */}
      <View style={{ 
        borderBottomColor: 'lightgray', 
        borderBottomWidth: 1, 
        marginHorizontal: 16, 
        marginBottom: 80 
      }} className="gap-y-10" />

      {/* Título */}
      <View className="items-center px-2 ">
        <Text 
        style={{ fontSize: hp(5) }}
        className="font-bold text-center text-black leading-tight">
          🎉 La Diversión en Cada Pinta & la Fiesta en Cada Barril 🍺
        </Text>
      </View>

      {/* Subtítulo */}
      <View className="items-center px-4 mt-40">
        <Text className="text-sm  text-gray-500 ">
          Regístrate para acceder a promociones únicas. De lo contrario, ingresa como invitado
        </Text>
      </View>

      {/* Botones de Inicio de Sesión y Registro */}
      <View className="flex-row justify-center mt-auto mb-10 space-x-4">
        <TouchableOpacity
          className="bg-white border-2 border-yellow-500 rounded-2xl px-6 py-3"
          onPress={handleSignIn}
        >
          <Text className="text-black text-lg">Iniciar Sesión</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-yellow-500 rounded-2xl px-6 py-3"
          onPress={handleSignUp}
        >
          <Text className="text-white text-lg">Registrarse</Text>
        </TouchableOpacity>
      </View>

      {/* Texto de Ingreso como Invitado */}
      <View className="items-center mt-4 mb-10">
        <TouchableOpacity>
          <Text className="text-gray-500 text-lg">Ingresar como invitado</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
