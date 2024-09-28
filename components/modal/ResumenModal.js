// ResumenModal.js
import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';

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

        {/*[Seccion - Direccion de Envio] */}
        <Text className="text-lg font-semibold mb-4">Dirección de Envio</Text>
        <View className="flex-row gap-2 justify-center">
          <TextInput className="rounded-lg bg-gray-100 text-base  p-2 " placeholder='Dirección de Envio'></TextInput>
          <TextInput className="rounded-lg bg-gray-100 text-base p-2" placeholder='Numero'></TextInput>
          <TextInput className=" rounded-lg bg-gray-100 text-base p-2" placeholder='Dirección de Envio'></TextInput>
        </View>

        {/*[Seccion - Servicio de Bartender] */}
        <View className="flex-row items-center pt-2 justify-between ">
          <Text className="text-lg font-semibold ">Servicio de Bartender</Text>
          <CheckBox />
        </View>

        {/*[Seccion - Servicio de Barril Adicional] */}
        <View className="flex-col pt-2">
          <Text className="text-lg font-semibold ">Seleccionar Barril adicional</Text>
          <TextInput className=" rounded-lg bg-gray-100 text-base p-2" placeholder='Seleccionar Producto'></TextInput>
        </View>

        {/*[Seccion - Servicio de Horario de Envio] */}
        <View className="flex-col pt-2">
          <Text className="text-lg font-semibold ">Horario de Envio</Text>
          <View className="flex-row gap-2">
            <Text className="text-lg ">Selecionar Fecha</Text>
            <Text className="text-lg ">Selecionar Hora</Text>
          </View>
        </View>

        {/*[Seccion - Servicio de Codigo de Descuento] */}
        <View className="flex-col pt-2">
          <Text className="text-lg font-semibold ">Codigo de Descuento</Text>
          <TextInput className=" rounded-lg bg-gray-100 text-base p-2" placeholder='Seleccionar Producto'></TextInput>
        </View>

        {/*[Seccion - Servicio de Facturacion] */}
        <View className="border rounded-lg p-2">
          <Text className="text-lg font-semibold mb-4">Facturación</Text>
          {/* Muestra los productos del carrito */}
          {cart.map((item) => (
            <View key={item._id} className="flex-row justify-between mb-2">
              <Text>{item.name}</Text>
              <Text>${(item.price * item.quantity).toLocaleString('es-ES', { maximumFractionDigits: 0 })}</Text>
            </View>
          ))}
         <Text className="flex-row justify-between mb-2">Envío</Text>
          <Text className="flex-row justify-between mb-2">Bartender</Text>
          <Text className="flex-row justify-between mb-2">Barril Adicional</Text>
          <Text className="flex-row justify-between mb-2">Descuento</Text>


          <View className="flex-row justify-between mt-4">
            <Text className="text-lg font-semibold">Total</Text>
            <Text className="text-lg font-semibold">${total.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</Text>
          </View>
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

export default ResumenModal;
