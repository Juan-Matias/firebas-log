import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import TabBarButton from './TarBarButton'; // Componente personalizado para los botones de la TabBar
import { CartContext } from '../../hooks/CartContext/useCartContext'; // Importa el contexto

// Componente TabBar
export default function TabBar({ state, descriptors, navigation }) {
  const { cartItemCount } = useContext(CartContext); // Accede al contexto

  const primaryColor = '#0891b2'; // Color principal para el ítem activo
  const greyColor = '#737373';    // Color gris para los ítems no activos
  const colorTabBar = '#ffffff';  // Color de fondo de la barra de navegación

  return (
    <View
      style={{
        backgroundColor: colorTabBar,
        borderColor: greyColor,
        borderWidth: 0.5,
      }}
      className="
        flex-row justify-between 
        items-center py-4 shadow-black shadow-lg rounded-2xl
      "
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
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

      {/* Muestra la cantidad de artículos en el carrito */}
      <View className="absolute top-0 right-0 mt-2 mr-4">
        <Text className="bg-red-500 text-white rounded-full px-2">
          {cartItemCount}
        </Text>
      </View>
    </View>
  );
}
