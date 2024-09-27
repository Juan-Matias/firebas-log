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
const cardWidth = wp(58);
const cardHeight = hp(40.5);

const CustomCardTitle = ({ title = 'Título predeterminado' }) => (
  <Text className="font-bold text-lg text-black">{title}</Text>
);

const CartItems = () => {
  const dispatch = useDispatch(); // Inicializa dispatch

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartItems = useSelector((state) => state.cart.items); // Obtiene los productos en el carrito

  const [products, setProducts] = useState([]);

  // [Logica de Agregar , Quitar , Contador]
  const handleAgregarProducto = (product) => {
    dispatch(addToCart(product)); // Usa dispatch para agregar el producto
    //console.log("Producto Agregado", product);
  };

  const getCantidadProducto = (productId) => {
    const item = cartItems.find((item) => item._id === productId);
    return item ? item.quantity : 0; // Devuelve la cantidad de productos en el carrito
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
        <View key={product._id} className="mr-7">
          <Card
            className=" items-center pt-2 rounded-2xl bg-white shadow-transparent"
            style={{ width: cardWidth, height: cardHeight }}>

            <Card.Cover
              source={{ uri: urlFor(product.image.asset.url).quality(80).url() }}
              style={{ width: imageWidth, height: imageHeight }}
              resizeMode="cover"
              className="border-gray-400 border shadow-none"
            />

            {/* Texto*/}
            <View className="pl-2 pt-1 ">

              <CustomCardTitle title={product.name} />
              <Text className=" font-bold text-base text-neutral-500">
                {product.barrel || 'Descripción predeterminada'} ${product.barrelPrice || 'Precio no disponible'}
              </Text>
              <Text className="pt-2 text-base">{product.description || 'Descripción predeterminada'}</Text>
              
              <View className="flex-row items-center">
                <Text className="text-base text-red-500 font-bold">$ {product.price || 'Precio no disponible'}</Text>

                {/* Mostrar cantidad en el carrito   */}
                
                {getCantidadProducto(product._id) > 0 && (
                  <View className="border border-gray-600 rounded-sm w-10 h-9 items-center ml-24 bg-gray-100">
                  <Text className="text-base font-semibold pt-1">{getCantidadProducto(product._id)}</Text>
                  </View>
                )}
              </View>

            </View>



            {/* Botones de agregar y quitar producto */}

            <View className="pt-4 items-center">
              <Button
                mode="contained"
                className="bg-amber-500 rounded-lg w-52 "
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
