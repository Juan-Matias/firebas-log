import React from 'react';
import { View, Text, Image, FlatList, Dimensions } from 'react-native';

const { width } = Dimensions.get('window'); // Obtén el ancho de la pantalla

const Carrusel = ({ items }) => {
  return (
    <FlatList
      data={items} // Recibe los items desde el componente Home
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View className="w-[${width}px] items-center justify-center">
          <Image
            source={{ uri: item.image }} // Muestra la imagen desde la URL
            className="w-96 h-96" // Ajusta el tamaño de la imagen
            resizeMode="cover"
          />
          <Text className="text-2xl font-bold mt-2 text-center">
            {item.title}
          </Text>
          <Text className="text-base text-gray-600 mt-1 text-center">
            {item.text}
          </Text>
        </View>
      )}
      pagingEnabled
    />
  );
};

export default Carrusel;
