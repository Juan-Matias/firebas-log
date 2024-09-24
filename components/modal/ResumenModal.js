// ResumenModal.js
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';

// Componente para mostrar el resumen de la compra
const ResumenModal = ({ isVisible, onClose, cart, total }) => {
  return (
    <Modal
      isVisible={isVisible} // Controla la visibilidad
      onBackdropPress={onClose} // Cierra al tocar fuera
      swipeDirection="down" // Permite cerrar deslizando hacia abajo
      onSwipeComplete={onClose} // Cierra al completar el deslizamiento
      style={{ justifyContent: 'flex-end', margin: 0 }} // Estilos
    >
      <View className="bg-white p-4 rounded-t-lg">
        <Text className="text-lg font-semibold mb-4">Resumen de la Compra</Text>
        {/* Muestra los productos del carrito */}
        {cart.map((item) => (
          <View key={item._id} className="flex-row justify-between mb-2">
            <Text>{item.name}</Text>
            <Text>${(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
        <View className="flex-row justify-between mt-4">
          <Text className="text-lg font-semibold">Total</Text>
          <Text className="text-lg font-semibold">${total.toFixed(2)}</Text>
        </View>
        <Button
          mode="contained"
          className="mt-6 bg-amber-500 rounded-lg"
          labelStyle={{ color: 'white' }}
          onPress={onClose} // Cierra el modal al presionar
        >
          Confirmar Reserva
        </Button>
      </View>
    </Modal>
  );
};

export default ResumenModal; // Exporta el componente
