import * as React from 'react';
import { Text, View, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width } = Dimensions.get('window');

const Carrusel = ({ items }) => {
  return (
    <View className="flex-1 flex-row justify-center">
      <Carousel
        data={items}
        width={width}
        renderItem={({ item }) => (
          <View className="bg-gray-400 rounded-lg h-64 p-12 mx-6">
            <Text className="text-3xl">{item.title}</Text>
            <Text>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
};

export default Carrusel;
