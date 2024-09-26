import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import TabBarButton from './TarBarButton'; // Asegúrate de que la ruta sea correcta
import { CartContext } from '../../hooks/CartContext/useCartContext'; // Asegúrate de que la ruta sea correcta
import { useSelector } from 'react-redux';

export default function TabBar({ state, descriptors, navigation }) {
  const { cart } = useContext(CartContext); // Obtener el carrito desde el contexto
  const cartItems = useSelector(state => state.cart.items); // Obtiene los productos en el carrito desde Redux

  // Colores del TabBar
  const primaryColor = '#0891b2';
  const greyColor = '#737373';
  const colorTabBar = '#ffffff';

  // Función para obtener la cantidad de un producto en el carrito
  const getCantidadProducto = (productId) => {
    console.log("Buscando producto con ID:", productId);
    const item = cartItems.find(item => item._id === productId);
    console.log("Producto encontrado:", item);
    return item ? item.quantity : 0;  // Devuelve la cantidad de productos en el carrito
  };

  // Asegúrate de que `cart` contenga productos y que se actualice correctamente
  const firstProductId = cart.length > 0 ? cart[0]._id : null;
  console.log("ID del primer producto:", firstProductId);

  // Utiliza `firstProductId` para obtener la cantidad
  const cantidadPrimerProducto = firstProductId ? getCantidadProducto(firstProductId) : 0;
  console.log("cantidad Producto", cantidadPrimerProducto);

  return (
    <View
      style={{
        backgroundColor: colorTabBar,
        borderColor: greyColor,
        borderWidth: 0.5,
      }}
      className="flex-row justify-between items-center py-4 shadow-black shadow-lg rounded-2xl"
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label = options.tabBarLabel !== undefined
          ? options.tabBarLabel
          : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TabBarButton
            key={route.key}
            onPress={onPress}
            onLongPress={onLongPress}
            isFocused={isFocused}
            routeName={route.name}
            color={isFocused ? primaryColor : greyColor}
            label={label}
            className="flex-1"
          />
        );
      })}

      {/* Mostrar el contador solo si hay productos en el carrito */}
      {cantidadPrimerProducto > 0 && (
        <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
          <Text style={{ backgroundColor: 'red', color: 'white', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
            {cantidadPrimerProducto}
          </Text>
        </View>
      )}
    </View>
  );
}
