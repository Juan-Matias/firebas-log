import React from "react";
import { View, Text } from "react-native";
import TabBarButton from "./TarBarButton"; // Asegúrate de que la ruta sea correcta
import { useSelector } from "react-redux"; // Usar Redux para obtener los productos del carrito

export default function TabBar({ state, descriptors, navigation }) {
  // Obtiene los productos en el carrito desde Redux
  const cartItems = useSelector((state) => state.cart.items);

  // Colores del TabBar
  const primaryColor = "#0891b2";
  const greyColor = "#737373";
  const colorTabBar = "#ffffff";

  // Función para obtener el total de productos en el carrito
  const getTotalProductos = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Obtiene el total de productos en el carrito
  const totalProductos = getTotalProductos();

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
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: "tabLongPress",
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

      {/* Mostrar el contador de productos solo si hay productos en el carrito */}
      {totalProductos > 0 && (
        <View
          style={{
            position: "absolute",
            top: 10,
            right: 88,
            backgroundColor: "red",
            borderRadius: 12,
            paddingHorizontal: 8,
            paddingVertical: 2,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>
            {totalProductos}
          </Text>
        </View>
      )}
    </View>
  );
}
