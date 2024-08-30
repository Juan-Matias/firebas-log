import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, TextInput } from 'react-native'; // Importa TextInput desde 'react-native'
import Carrusel from '../../components/carrusel.js'; // Componente Carrusel
import { getEvento } from '../../conection/SanityConection/api.js';
import { urlFor } from '../../sanity.js'; // Importa la función urlFor
import { StatusBar } from 'expo-status-bar';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Octicons } from '@expo/vector-icons';

export default function Home() {
  const [carouselItems, setCarouselItems] = useState([]);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const data = await getEvento();
        
        // Revisa y genera las URLs de las imágenes
        const formattedData = data.map(evento => {
          const imageUrl = urlFor(evento.image.asset._ref).url();
          //console.log('URL de la imagen:', imageUrl); // Log para depuración
          return {
            title: evento.name,
            text: evento.description,
            image: imageUrl, // Utiliza la URL generada
          };
        });

        //console.log('Datos formateados:', formattedData); // Log para depuración

        setCarouselItems(formattedData);
      } catch (error) {
        //console.error('Error fetching data:', error);
      }
    };
    fetchEventos();
  }, []);

  return (
    <SafeAreaView className="bg-white">
      <StatusBar barStyle="dark-content"/>
      {/* Buscador */}
      <View className="flex-row items-center space-x-2 px-4 pb-2">
        <View className="flex-row flex-1 items-center p-3 rounded-full border border-gray-300">
          <Octicons name="mail" size={hp(2.7)} />
          <TextInput placeholder='Buscador' className="ml-2 flex-1"/>
          <View className="flex-row items-center space-x-1 border-0 border-l-2 pl-2 border-l-gray-300">
            {/* Contenido del buscador */}
          </View>
        </View>
      </View>
      <Text>hola</Text>
      <Carrusel items={carouselItems} />
      <Text>hola</Text>
    </SafeAreaView>
  );
}
