import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


import { fetchProducts } from '../../conection/SanityConection/api.js';
import { urlFor } from '../../sanity.js'; 

// Ajusta el tamaño de la imagen
const imageWidth = wp(54);
const imageHeight = hp(17);

// Ajusta el tamaño de la tarjeta
const cardWidth = wp(60); // Ajustar el ancho de la tarjeta
const cardHeight = hp(41); // Ajustar la altura de la tarjeta


// Componente para el título de la tarjeta
const CustomCardTitle = ({ title = 'Título predeterminado' }) => (
  <Text className="font-bold text-lg text-black">
    {title}
  </Text>
);

const CartItems = () => {
  const [products, setProducts] = useState([]); // Estado para almacenar los productos
  const [loading, setLoading] = useState(true); // Estado para el indicador de carga
  const [error, setError] = useState(null); // Estado para manejar errores

  // useEffect para obtener los productos al montar el componente
  useEffect(() => {
    const getProducts = async () => {
      try {
        const data = await fetchProducts();
        setProducts(data);
      } catch (error) {
        setError(error);
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const handleAgregarProducto = async () => {
    // Lógica para agregar el producto
    console.log('Producto agregado');
  };

  // Mostrar indicador de carga si los productos aún no se han cargado
  if (loading) {
    return (
      <ActivityIndicator
        size="large"
        color="#0000ff"
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      />
    );
  }

  // Mostrar un mensaje de error si ocurre un problema al cargar los productos
  if (error) {
    return (
      <Text className="flex-1 text-center text-red-500 text-lg">
        Error loading products
      </Text>
    );
  }

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 10 }}
    >
      {/* Iterar sobre los productos y renderizar cada uno */}
      {products.map((product) => (
        <View key={product._id} className="mr-5">
          {/* Imagen del producto */}
          <Card
            className="border-gray-300 p-3 border rounded-2xl bg-white"
            style={{ width: cardWidth, height: cardHeight }}
          >
            <Card.Cover
            
              source={{ uri: urlFor(product.image.asset.url).quality(80).url() }}
              style={{
                width: imageWidth,
                height: imageHeight,
              }}
              resizeMode="cover"
              className="border"
            />

            <View className="p-4">
              {/* Título del producto */}
              <CustomCardTitle title={product.name} />

              <Text className="mb-2 font-bold text-base text-gray-500">
                {/* Barril adicional */}
                {product.barrel || 'Descripción predeterminada'} ${product.barrelPrice || 'Precio no disponible'}
              </Text>

              {/* Descripción del producto */}
              <Text className="mb-2 text-base">
                {product.description || 'Descripción predeterminada'}
              </Text>

              {/* Precio del producto */}
              <Text className="mb-2 text-base text-red-500">
                $ {product.price || 'Precio no disponible'}
              </Text>

              {/* Botón Agregar */}
              <Button
                mode="contained"
                className="bg-amber-500 rounded-lg"
                labelStyle={{ color: 'white', fontSize: 16 }} // Ajustar el tamaño de la letra
                onPress={() => handleAgregarProducto(product)} // Pasar el producto como argumento
              >
                AGREGAR
              </Button>
            </View>
          </Card>
        </View>
      ))}
    </ScrollView>
  );
};

export default CartItems;