import { View, Text } from 'react-native';
import React from 'react';
import { Stack, Tabs } from 'expo-router';
import TabBar from '../../components/Tarbar.js'; // Asegúrate de que el nombre sea correcto

export default function Layout() {
  return (
    <Tabs
      tabBar={props => 
        <TabBar {...props} />
      }
    >
      {/* Cambio de nombre HOME */}
      <Tabs.Screen
        name='home'
        options={{
          title: "Home"
        }}
      />

      {/* Cambio de nombre productos */}
      <Tabs.Screen
        name='productos'
        options={{
          title: "Productos"
        }}
      />

      {/* Cambio de nombre pedidos */}
      <Tabs.Screen
        name='pedidos'
        options={{
          title: "Pedidos"
        }}
      />

      {/* Cambio de nombre Carrito */}
      <Tabs.Screen
        name='carrito'
        options={{
          title: "Carrito"
        }}
      />

      {/* Cambio de nombre perfil */}
      <Tabs.Screen
        name='perfil'
        options={{
          title: "Perfil"
        }}
      />
    </Tabs>
  );
}
