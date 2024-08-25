import React, { useEffect } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { icons } from '../assets/icons'; // Asegúrate de que esta ruta sea correcta
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

export default function TabBarButton(props) {
  const { isFocused, label, routeName, color } = props;
  
  // Efecto de animación
  const scale = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(
      isFocused ? 1 : 0,
      { duration: 350 }
    );
  }, [isFocused]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(
      scale.value,
      [0, 1],
      [1, 1.4]
    );

    const top = interpolate(
      scale.value,
      [0, 1],
      [0, 8]
    );
    return {
      transform: [{ scale: scaleValue }],
      top
    };
  });

  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scale.value,
      [0, 1],
      [1, 0]
    );

    return {
      opacity
    };
  });

  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={animatedIconStyle}>
        {icons[routeName]({
          color, // Aplica un color diferente si el botón está enfocado
        })}
      </Animated.View>

      <Animated.Text style={[{
        color, // Cambia el color del texto si está enfocado
        fontSize: 12,
        marginTop: 4, // Espacio entre el icono y el texto
      },animatedTextStyle]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4
  }
});
