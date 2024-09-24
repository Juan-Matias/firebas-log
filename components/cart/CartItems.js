import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { fetchProducts } from '../../conection/SanityConection/api.js';
import { useDispatch, useSelector } from 'react-redux';

import { urlFor } from '../../sanity.js';
import { addToCart, removeFromCart } from '../../slider/cartSlice.js'; // Asegúrate de que la ruta sea correcta

const imageWidth = wp(54);
const imageHeight = hp(17);
const cardWidth = wp(60);
const cardHeight = hp(47);

const CustomCardTitle = ({ title = 'Título predeterminado' }) => (
  <Text className="font-bold text-lg text-black">{title}</Text>
);

const CartItems = () => {
  const dispatch = useDispatch(); // Inicializa dispatch

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [products, setProducts] = useState([]);
  const cartItems = useSelector(state => state.cart.items); // Obtiene los productos en el carrito

  // [Logica de Agregar , Quitar , Contador]
  const handleAgregarProducto = (product) => {
    dispatch(addToCart(product)); // Usa dispatch para agregar el producto

  };

  const handleQuitarProducto = (productId) => {
    dispatch(removeFromCart(productId)); // Usa dispatch para quitar el producto

  };

  const getCantidadProducto = (productId) => {
    const item = cartItems.find(item => item._id === productId);
    return item ? item.quantity : 0;  // Devuelve la cantidad de productos en el carrito
  };

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

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} />;
  }

  if (error) {
    return <Text className="flex-1 text-center text-red-500 text-lg">Error loading products</Text>;
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
      {products.map((product) => (
        <View key={product._id} className="mr-5">
          <Card className="border-gray-300 p-3 border rounded-2xl bg-white" style={{ width: cardWidth, height: cardHeight }}>
            <Card.Cover
              source={{ uri: urlFor(product.image.asset.url).quality(80).url() }}
              style={{ width: imageWidth, height: imageHeight }}
              resizeMode="cover"
              className="border"
            />

            <View className="p-4">
              <CustomCardTitle title={product.name} />
              <Text className="mb-2 font-bold text-base text-gray-500">
                {product.barrel || 'Descripción predeterminada'} ${product.barrelPrice || 'Precio no disponible'}
              </Text>
              <Text className="mb-2 text-base">{product.description || 'Descripción predeterminada'}</Text>
              <Text className="mb-2 text-base text-red-500">$ {product.price || 'Precio no disponible'}</Text>

              {/* Mostrar cantidad en el carrito */}
              {getCantidadProducto(product._id) > 0 && (
                <Text className="mb-2 text-base">Cantidad en carrito: {getCantidadProducto(product._id)}</Text>
              )}

              {/* Botones de agregar y quitar producto */}

                <Button
                  mode="contained"
                  className="bg-amber-500 rounded-lg"
                  labelStyle={{ color: 'white', fontSize: 16 }}
                  onPress={() => handleAgregarProducto(product)}
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
