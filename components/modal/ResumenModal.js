import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, ScrollView } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import cliente from '../../sanity';
import CustomKeyboardView from '../keyboard/CustomKeyboardView';

// Lógica
const ResumenModal = ({ isVisible, onClose, cart, total }) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isBartenderService, setIsBartenderService] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [barrels, setBarrels] = useState([]);
  const [bartenderPrice] = useState(15000); // Precio del servicio de bartender
  const [additionalBarrelPrice, setAdditionalBarrelPrice] = useState(0); // Precio del barril adicional

  // Función para obtener las comunas desde Sanity
  const fetchCommunes = async () => {
    const query = '*[_type == "comuna"]{name}';
    const result = await cliente.fetch(query);
    setCommunes(result.map(comuna => ({ label: comuna.name, value: comuna.name })));
  };

  // Función para obtener los barriles adicionales desde Sanity
  const fetchBarrels = async () => {
    const query = '*[_type == "barrilAdicional"]{name, price}'; // Consulta ambos campos
    const result = await cliente.fetch(query);

    // Mapear los resultados para incluir tanto el nombre como el precio
    setBarrels(result.map(barril => ({
      label: `${barril.name} - $${barril.price}`, // Mostrar nombre y precio juntos
      value: barril.name,
      price: barril.price // Guardar precio
    })));
  };

  useEffect(() => {
    fetchCommunes();
    fetchBarrels();
  }, []);

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



  
  // Función para manejar la selección del barril adicional
  const handleBarrelSelect = (value) => {
    console.log("Valor seleccionado:", value); // Para depuración
    const barrels = [
      { label: 'Ningún barril adicional', value: null }, // Asegúrate de que esta línea esté aquí
      { label: 'CRISTAL 30 LTS', value: 'cristal_30lts', price: 100 },
      { label: 'HEINEKEN 30 LTS', value: 'heineken_30lts', price: 120 },
      // Otros barriles...
    ];
    
    // Si el valor es null, significa que "Ningún barril adicional" está seleccionado
    if (value === null) {
      // Si se selecciona "Ningún barril adicional"
      setSelectedProduct(null); // Reinicia la selección
      setAdditionalBarrelPrice(0); // Establece el precio a 0
    } else {
      const selectedBarrel = barrels.find(barrel => barrel.value === value);
      if (selectedBarrel) {
        setSelectedProduct(selectedBarrel.value); // Establece el barril seleccionado
        setAdditionalBarrelPrice(selectedBarrel.price); // Establece el precio del barril seleccionado
      }
    }
  };

  // Diseño
  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ justifyContent: 'flex-end', margin: 0 }}
    >
      <CustomKeyboardView>
        <View className="bg-white p-4 rounded-t-lg">
          {/* Sección - Dirección de Envio */}
          <Text className="text-lg font-semibold mb-4">Dirección de Envio</Text>
          <View className="flex-row gap-2 justify-center">
            <TextInput className="rounded-lg bg-gray-100 text-base p-2" placeholder='Dirección de Envio' />
            <TextInput className="rounded-lg bg-gray-100 text-base p-2" placeholder='Número' />
            {/* Picker para seleccionar la ciudad */}
            <View className="flex-1 rounded-lg bg-gray-100">
              <RNPickerSelect
                onValueChange={(value) => setSelectedCity(value)}
                placeholder={{ label: 'Seleccionar Ciudad', value: null }}
                items={communes}
              />
            </View>
          </View>

          {/* Sección - Servicio Telefono */}
          <View className="pt-2 bg-white rounded-t-lg">
            <TextInput className="rounded-lg bg-gray-100 text-base p-2" placeholder='Telefono' />
          </View>

          {/* Sección - Servicio de Bartender */}
          <View className="flex-row items-center pt-4 justify-between">
            <View className="flex-col">
              <Text className="text-lg font-semibold">Servicio de Bartender</Text>
              <Text className="text-base font-semibold text-red-500">Precio $ 15.000</Text>
            </View>
            <CheckBox
              checked={isBartenderService}
              onPress={() => setIsBartenderService(!isBartenderService)}
            />
          </View>

          {/* Sección - Servicio de Barril Adicional */}
          <View className="flex-col pt-4">
            <Text className="text-lg font-semibold">Seleccionar Barril adicional</Text>
            <View className="rounded-lg bg-gray-100">
            <RNPickerSelect
  onValueChange={handleBarrelSelect}
  value={selectedProduct} // Controla el valor del selector
  placeholder={{ label: 'Ningún barril adicional', value: null }} // Placeholder para ningún barril
  items={barrels}
/>

</View>
          </View>

          {/* Sección - Horario de Envio */}
          <View className="flex-col pt-4">
            <Text className="text-lg font-semibold">Horario de Envio</Text>
            <View className="flex-row justify-center gap-3 pt-2">
              <Button mode="outlined" onPress={showDatePicker}>
                {selectedDate ? selectedDate : 'Seleccionar Fecha'}
              </Button>
              <Button mode="outlined" onPress={showTimePicker}>
                {selectedTime ? selectedTime : 'Seleccionar Hora'}
              </Button>
            </View>

            {/* Modal para seleccionar la fecha */}
            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={handleDateConfirm}
              onCancel={hideDatePicker}
            />

            {/* Modal para seleccionar la hora */}
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
            {cart.map((item) => (
              <View key={item._id} className="flex-row justify-between mb-2">
                <Text>{item.name}</Text>
                <Text>${(item.price * item.quantity).toLocaleString('es-ES', { maximumFractionDigits: 0 })}</Text>
              </View>
            ))}
            <Text className="flex-row justify-between mb-2">Envío</Text>
            <Text className="flex-row justify-between mb-2">Bartender: ${isBartenderService ? bartenderPrice.toLocaleString('es-ES', { maximumFractionDigits: 0 }) : 0}</Text>
            <Text className="flex-row justify-between mb-2">Barril Adicional: ${additionalBarrelPrice.toLocaleString('es-ES', { maximumFractionDigits: 0 })}</Text>
            <Text className="flex-row justify-between mb-2">Descuento</Text>

            <View className="flex-row justify-between mt-4">
              <Text className="text-lg font-semibold">Total</Text>
              <Text className="text-lg font-semibold">
                ${total + (isBartenderService ? bartenderPrice : 0) + additionalBarrelPrice}
              </Text>
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
      </CustomKeyboardView>
    </Modal>
  );
};

export default ResumenModal;
