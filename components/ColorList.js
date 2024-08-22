import { View, ScrollView, StyleSheet } from 'react-native';
import React from 'react';

export default function ColorList({ color }) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {
        [1, 0.8, 0.5].map(opacity => (
          <View
            key={opacity}
            style={[styles.color, { backgroundColor: color, opacity }]}
          />
        ))
      }
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  color: {
    width: '100%', // Esto define el ancho completo del contenedor
    height: 150,
    borderRadius: 25, // Corrección: Era `borderRadius`, no `borderRaius`
    marginBottom: 15,
  },
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10, // Corrección: Era `paddingVertical`, no `paddingVerical`
  }
});
