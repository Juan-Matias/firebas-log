import React, { useEffect } from 'react';
import { View, Text, Animated } from 'react-native';

export default function Alert({ message, onDismiss }) {
  const opacity = new Animated.Value(1);

  useEffect(() => {
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onDismiss());
    }, 3000); // Duración antes de ocultar la alerta

    return () => clearTimeout(timer);
  }, []);

  return (
<Animated.View 
  style={{ opacity, bottom: 100 }} 
  className="absolute left-0 right-0 items-center z-50"
>
  <View className="bg-red-500 px-10 py-2 rounded-xl">
    <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>
      {message}
    </Text>
  </View>
</Animated.View>
  );
}
