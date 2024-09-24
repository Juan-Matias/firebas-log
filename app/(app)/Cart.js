// Carrito.js
import { View, Image, Text, FlatList,TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart, removeFromCart } from '../../slider/cartSlice.js';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import ResumenModal from '../../components/modal/ResumenModal.js'; // Asegúrate de que la ruta sea correcta



// Tamaño de la imagen
const imageWidth = wp(54);
const imageHeight = hp(17);

const Carrito = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const [isModalVisible, setModalVisible] = useState(false);

  const handleSignIn = () => {
    navigation.navigate('Products');
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  // Renderizar cada ítem del carrito
  const renderCartItem = ({ item }) => (
    <View>
      <View className="m-2 p-2 rounded-lg bg-gray-50 flex-row items-center"
      style={{height:hp(15)}}
      >
        {/* Imagen del producto */}
        <Image
          source={{ uri: item.image.asset.url }} // Asegúrate de que la URL de la imagen sea válida
          style={{ width: wp(38), height: hp(12) }}
          className="rounded-xl"
          resizeMode="cover"
        />

        {/* Texto - nombre precio - precio */}
        <View className="pl-4">
          <Text className="text-lg font-semibold ">{item.name || 'Nombre no disponible'}</Text>

          <Text className="text-base mt-2">${item.price || 'Precio no disponible'}</Text>

          {/* Contador de cantidad */}
          <View className="items-center justify-between mt-3 flex-row">
            {/* Botón para disminuir la cantidad */}

            <TouchableOpacity
              onPress={() => dispatch(removeFromCart(item._id))} // Disminuir cantidad
              disabled={item.quantity <= 0} >
              <AntDesign name="minuscircle" size={hp(2.7)} color={"grey"} />
            </TouchableOpacity>

            {/* Mostrar la cantidad actual */}
            <Text className="text-lg ">{item.quantity}</Text>


            {/* Botón para aumentar la cantidad */}
            <TouchableOpacity
              onPress={() => dispatch(addToCart(item))} // Disminuir cantidad
              disabled={item.quantity <= 0} >
              <AntDesign name="pluscircle" size={hp(2.7)} color={"#E8A500"} />
            </TouchableOpacity>

          </View>
        </View>


      </View>
    </View>
  );


  return (
    <View className="flex-1 p-4 bg-white">
      {/* Verifica si el carrito está vacío */}
      {cart.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          {/* Imagen que se muestra cuando no hay productos en el carrito */}
          <Image
            source={require('../../assets/imagen-mascota/Cerveza-carrito.png')}
            className="w-72 h-72"
            resizeMode="contain"
          />
          {/* Mensaje indicando que el carrito está vacío */}
          <Text className="mt-4 text-lg font-semibold text-gray-700 text-center">
            ¡Mmmmmmm! Parece que aún no añades ningún pedido a tu carrito.
          </Text>
          {/* Botón para navegar a la pantalla de productos */}
          <Button
            mode="contained"
            onPress={handleSignIn}
            className="mt-6 bg-amber-500 rounded-lg"
            labelStyle={{ color: 'white' }}
          >
            Añadir barriles
          </Button>
        </View>
      ) : (
        <View className="flex-1">
          {/* Lista de productos en el carrito */}
          <FlatList
            data={cart} // Los datos a mostrar son los productos en el carrito
            renderItem={renderCartItem} // Función que renderiza cada ítem del carrito
            keyExtractor={(item) => item._id ? item._id.toString() : `${item.id}`} // Genera una clave única para cada ítem
          />
          {/* Botón para abrir el modal de reserva */}
          <Button
            mode="contained"
            className="mt-4 bg-amber-500 rounded-lg"
            labelStyle={{ color: 'white' }}
            onPress={openModal} // Abre el modal cuando se presiona
          >
            Reservar
          </Button>
          {/* Componente Modal que muestra el resumen de la compra */}
          <ResumenModal 
            isVisible={isModalVisible} // Controla la visibilidad del modal
            onClose={closeModal} // Función para cerrar el modal
            cart={cart} // Pasa los productos del carrito al modal
            total={total} // Pasa el total de la compra al modal
          />
        </View>
      )}
    </View>
  );
};

export default Carrito;
