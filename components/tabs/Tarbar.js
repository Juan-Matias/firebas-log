import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import TabBarButton from './TarBarButton'; // Corrigiendo el typo en el nombre del archivo
import { CartContext } from '../../hooks/CartContext/useCartContext';

export default function TabBar({ state, descriptors, navigation }) {
  const { cartItemCount } = useContext(CartContext); // Obtenemos el contador del carrito desde el contexto

  const primaryColor = '#0891b2';
  const greyColor = '#737373';
  const colorTabBar = '#ffffff';

  // Verificar rutas y valor del contador
  console.log('Current route:', state.routes[state.index].name);
  console.log('cartItemCount:', cartItemCount);

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

      {/* Mostrar contador solo en la pestaña de "Carrito" */}
      {state.routes[state.index].name === 'Carrito' && cartItemCount > 0 && (
        <View style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}>
          <Text style={{ backgroundColor: 'red', color: 'white', borderRadius: 12, paddingHorizontal: 8, paddingVertical: 4 }}>
            {cartItemCount}
          </Text>
        </View>
      )}
    </View>
  );
}
