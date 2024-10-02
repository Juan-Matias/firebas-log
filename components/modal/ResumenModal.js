import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select'; 

const ResumenModal = ({ isVisible, onClose, cart, total }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCity, setSelectedCity] = useState(''); // Estado para la ciudad seleccionada
  const [selectedProduct, setSelectedProduct] = useState(''); // Estado para el barril adicional
  const [isBartenderService, setIsBartenderService] = useState(false); // Estado para el servicio de bartender

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleDateConfirm = (date) => {
    setSelectedDate(date.toLocaleDateString('es-ES'));
    hideDatePicker();
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const handleTimeConfirm = (time) => {
    setSelectedTime(time.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }));
    hideTimePicker();
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
        <View className="bg-white p-4 rounded-t-lg">

          {/* Sección - Dirección de Envio */}
          <Text className="text-lg font-semibold mb-4">Dirección de Envio</Text>
          <View className="flex-row gap-2 justify-center">
            <TextInput className="flex-1 rounded-lg bg-gray-100 text-base p-2" placeholder='Dirección de Envio' />
            <TextInput className="flex-1 rounded-lg bg-gray-100 text-base p-2" placeholder='Número' />
           {/* Picker para seleccionar la ciudad */}
           <View className="flex-1 rounded-lg bg-gray-100">
            <RNPickerSelect
              onValueChange={(value) => setSelectedCity(value)}
              placeholder={{ label: 'Seleccionar Ciudad', value: null }}
              items={[
                { label: 'Ciudad 1', value: '1' },
                { label: 'Ciudad 2', value: '2' },
                { label: 'Ciudad 3', value: '3' },
                { label: 'Ciudad 4', value: '4' },
                { label: 'Ciudad 5', value: '5' },
              ]}
            />
          </View>
        </View>

          {/* Sección - Servicio de Bartender */}
          <View className="flex-row items-center pt-4 justify-between">
            <Text className="text-lg font-semibold">Servicio de Bartender</Text>
            <CheckBox
              checked={isBartenderService}
              onPress={() => setIsBartenderService(!isBartenderService)}
            />
          </View>

          {/* Sección - Servicio de Barril Adicional */}
          <View className="flex-col pt-4">
            <Text className="text-lg font-semibold">Seleccionar Barril adicional</Text>
            {/* Picker para seleccionar el barril adicional */}
            <View className="rounded-lg bg-gray-100">
              <RNPickerSelect
                onValueChange={(value) => setSelectedProduct(value)}
                placeholder={{ label: 'Seleccionar Producto', value: null }}
                items={[
                  { label: 'Barril 1', value: 'barril1' },
                  { label: 'Barril 2', value: 'barril2' },
                  { label: 'Barril 3', value: 'barril3' },
                ]}
              />
            </View>
          </View>

          {/* Sección - Horario de Envio */}
          <View className="flex-col pt-4">
            <Text className="text-lg font-semibold">Horario de Envio</Text>
            
            <View className="flex-row justify-center gap-3 pt-2 ">
              {/* Botón para seleccionar la fecha */}
              <Button mode="outlined" onPress={showDatePicker}>
                Seleccionar Fecha
              </Button>
              <Text>{selectedDate}</Text>

              {/* Botón para seleccionar la hora */}
              <Button mode="outlined" onPress={showTimePicker}>
                Seleccionar Hora
              </Button>
              <Text>{selectedTime}</Text>
            </View>

            {/* Selectores modales de fecha y hora */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            <DateTimePickerModal
              isVisible={isTimePickerVisible}
              mode="time"
              onConfirm={handleTimeConfirm}
              onCancel={hideTimePicker}
            />
          </View>

          {/* Sección - Código de Descuento */}
          <View className="flex-col pt-4">
            <Text className="text-lg font-semibold">Código de Descuento</Text>
            <TextInput className="rounded-lg bg-gray-100 text-base p-2" placeholder='Introducir código de descuento' />
          </View>

          {/* Sección - Facturación */}
          <View className="border rounded-lg p-4 mt-4">
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
            onPress={onClose}
          >
            Confirmar Reserva
          </Button>
        </View>
    </Modal>
  );
};

export default ResumenModal;
