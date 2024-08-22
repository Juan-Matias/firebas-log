import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importa el ícono que deseas usar
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export default function Alert({ message, onDismiss }) {
  const opacity = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
//<View style={{ paddingTop: hp(5), paddingHorizontal: wp(1) }} className="flex-1">
  
return (
    <Animated.View 
    
      style={{ opacity,paddingTop: hp(93)}} 
      className="absolute left-0 right-0 items-center z-50"
    >
      <View className="bg-red-500  px-10 py-2 rounded-xl flex-row items-center">
        <Ionicons name="beer-outline" size={20} color="white" style={{ marginRight: 8 }} />
        <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}