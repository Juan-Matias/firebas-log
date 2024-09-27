import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Importaciones de Api
import { fetchProducts } from '../../conection/SanityConection/api.js';
import { urlFor } from '../../sanity.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../slider/cartSlice.js'; // Asegúrate de que la ruta sea correcta

const imageWidth = wp(44);
const imageHeight = hp(14);

const cardWidth = wp(45);
const cardHeight = hp(36.5);

const CustomCardTitle = ({ title = 'Título predeterminado' }) => (
  <Text className="font-bold text-lg text-black">{title}</Text>
);

const CardIProductos = ({ searchQuery }) => {
  const dispatch = useDispatch(); // Inicializa dispatch

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartItems = useSelector(state => state.cart.items); // Obtiene los productos en el carrito


  // [Logica de Agregar , Contador]
  const handleAgregarProducto = (product) => {
    dispatch(addToCart(product)); // Usa dispatch para agregar el producto
    console.log("Producto agregado:", product);
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


  const filteredProducts = products.filter(product => {
    const query = searchQuery ? searchQuery.toLowerCase() : '';
    const name = (product.name || '').toLowerCase();
    const description = (product.description || '').toLowerCase();
    const price = (String(product.price) || '').toLowerCase();

    return name.includes(query) || description.includes(query) || price.includes(query);
  });

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" className="flex-1 justify-center items-center" />
    );
  }

  if (error) {
    return (
      <Text className="flex-1 text-center text-red-500 text-lg">
        Error loading products
      </Text>
    );
  }

  return (
    <ScrollView contentContainerStyle="px-5 ">
      {filteredProducts.length === 0 && searchQuery !== '' && (
        <Text className="flex-1 text-center text-gray-500 text-lg mt-4 ">
          No se encontraron productos que coincidan con "{searchQuery}"
        </Text>
      )}
      <View className="flex-row flex-wrap justify-between bg-gray-100">
        {filteredProducts.map((product, index) => (

          <View key={product._id ? product._id : index} className="mb-5 ">
            <Card className="  rounded-2xl items-center shadow-none bg-white"
              style={{ width: cardWidth, height: cardHeight, marginHorizontal: 8.1 }}>

              <View className="items-center">
                <Card.Cover
                  source={{ uri: urlFor(product.image.asset.url).quality(80).url() }}
                  style={{ width: imageWidth, height: imageHeight }}
                  resizeMode="cover"
                  className="border-gray-300 border shadow-xl"
                />
              </View>

              <View className="pl-2 pt-4">
                <CustomCardTitle title={product.name} />
                <Text className="font-bold text-sm text-gray-500">
                  {product.barrel || 'Descripción predeterminada'} ${product.barrelPrice || 'Precio no disponible'}
                </Text>
                <Text className="text-base pt-2">
                  {product.description || 'Descripción predeterminada'}
                </Text>

                <View className="flex-row items-center ">
                  <Text className="text-base text-red-500 font-bold">$ {product.price || 'Precio no disponible'}</Text>

                  {/* Mostrar cantidad en el carrito   */}
                 
                  {getCantidadProducto(product._id) > 0 && (
                    <View className="border border-gray-600 rounded-sm h-8 w-8  items-center  bg-gray-100 "
                    style={{marginLeft:wp(17)}}>
                      <Text className="text-base font-semibold ">{getCantidadProducto(product._id)}</Text>
                    
                    </View>
                 
                  )}
                </View>
                
              </View>
              {/* Btn - Agregar / Quitar */}
              <View className="pt-4 items-center">
                <Button
                  onPress={() => handleAgregarProducto(product)} // Agregar producto
                  mode="contained"
                  className="bg-amber-500 rounded-lg"
                  style={{width:wp(35)}}
                  labelStyle={{ color: 'white', fontSize: 16 }}
                >
                  AGREGAR
                </Button>
              </View>
            </Card>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CardIProductos;
