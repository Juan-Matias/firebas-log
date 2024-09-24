import React, { useState, useEffect } from 'react';
import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

// Importaciones de Api
import { fetchProducts } from '../../conection/SanityConection/api.js';
import { urlFor } from '../../sanity.js';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../slider/cartSlice.js'; // Asegúrate de que la ruta sea correcta

const imageWidth = wp(42.5);
const imageHeight = hp(13);

const cardWidth = wp(46);
const cardHeight = hp(50);

const CustomCardTitle = ({ title = 'Título predeterminado' }) => (
  <Text className="font-bold text-base text-black">{title}</Text>
);

const CardIProductos = ({ searchQuery }) => {
  const dispatch = useDispatch(); // Inicializa dispatch

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const cartItems = useSelector(state => state.cart.items); // Obtiene los productos en el carrito


  // [Logica de Agregar , Quitar , Contador]
  const handleAgregarProducto = (product) => {
    dispatch(addToCart(product)); // Usa dispatch para agregar el producto
    console.log("Producto agregado:", product);
  };

  const handleQuitarProducto = (productId) => {
    dispatch(removeFromCart(productId)); // Usa dispatch para quitar el producto
    console.log("Producto eliminado:", productId);
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
    <ScrollView contentContainerStyle="px-5">
      {filteredProducts.length === 0 && searchQuery !== '' && (
        <Text className="flex-1 text-center text-gray-500 text-lg mt-4">
          No se encontraron productos que coincidan con "{searchQuery}"
        </Text>
      )}
      <View className="flex-row flex-wrap justify-between ">
        {filteredProducts.map((product, index) => (
          <View key={product._id ? product._id : index} className="mb-5">
            <Card className="border-gray-300 p-1.5 border rounded-2xl bg-white"
            style={{ width: cardWidth, height: cardHeight, marginHorizontal: 8.1 }}>
            
            <Card.Cover
              source={{ uri: urlFor(product.image.asset.url).quality(80).url() }}
              style={{ width: imageWidth, height: imageHeight }}
              resizeMode="cover"
              className="border"
            />
            <View className="p-2">
              <CustomCardTitle title={product.name} />
              <Text className="mb-2 font-bold text-sm text-gray-500">
                {product.barrel || 'Descripción predeterminada'} ${product.barrelPrice || 'Precio no disponible'}
              </Text>
              <Text className="mb-2 text-base">
                {product.description || 'Descripción predeterminada'}
              </Text>
              <Text className="mb-2 text-base text-red-500">
                $ {product.price || 'Precio no disponible'}
              </Text>

              {/* Mostrar cantidad en el carrito */}
              <Text className="mb-2 text-base text-blue-500">
                Cantidad en el carrito: {getCantidadProducto(product._id)}
              </Text>


              {/* Btn - Agregar / Quitar */}
              <View > 
              
              <Button
                onPress={() => handleAgregarProducto(product)} // Agregar producto
                mode="contained"
                className="bg-amber-500 rounded-lg "
                labelStyle={{ color: 'white', fontSize: 16 }}
              >
                AGREGAR
              </Button>

              {/* Botón para quitar producto */}
              {getCantidadProducto(product._id) > 0 && (
                <Button
                  onPress={() => handleQuitarProducto(product._id)} // Remover producto
                  mode="contained"
                  className="bg-red-500 mt-2 rounded-lg"
                  labelStyle={{ color: 'white', fontSize: 16 }}
                >
                  QUITAR
                </Button>
              )}
              </View>
            </View>
          </Card>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default CardIProductos;
