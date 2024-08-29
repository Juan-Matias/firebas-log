import * as React from 'react';
import { SafeAreaView } from 'react-native';
import Carrusel from '../../components/carrusel.js'; // Importa el componente Carrusel

export default function Home() {
  const carouselItems = [
    { title: "Item 1", text: "Text 1" },
    { title: "Item 2", text: "Text 2" },
    { title: "Item 3", text: "Text 3" },
    { title: "Item 4", text: "Text 4" },
    { title: "Item 5", text: "Text 5" },
  ];

  return (
  
    <SafeAreaView style={{ flex: 1, paddingTop: 50 }}>
      <Carrusel items={carouselItems} />
    </SafeAreaView>
  );
}
