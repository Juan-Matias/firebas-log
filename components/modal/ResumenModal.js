import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { Button } from 'react-native-paper';
import Modal from 'react-native-modal';
import { CheckBox } from 'react-native-elements';
import RNPickerSelect from 'react-native-picker-select';
import { collection, doc, setDoc, Timestamp } from "firebase/firestore"; 

import cliente from '../../sanity'; // Asegúrate de tener configurada tu instancia de Sanity
import CustomKeyboardView from '../keyboard/CustomKeyboardView';
import DateTimeSelector from '../../components/dateTime/DateTimePickerModal.js';
import useFormValidation from '../../hooks/resumenModal/useFormValidation.js';
import { auth, db, usersRef } from '../../conection/FireBaseConection/firebaseConfig.js';

const ResumenModal = ({ isVisible, onClose, cart, total }) => {
  // Hook de validación de formularios
  const { formValues, errors, handleInputChange, validateForm, refs } = useFormValidation({
    address: '',
    phone: '',
    selectedCity: '',
    selectedDate: '',
    selectedTime: ''
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isBartenderService, setIsBartenderService] = useState(false);
  const [communes, setCommunes] = useState([]);
  const [barrels, setBarrels] = useState([]);
  const [bartenderPrice] = useState(15000);
  const [additionalBarrelPrice, setAdditionalBarrelPrice] = useState(0);

  useEffect(() => {
    const fetchCommunes = async () => {
      const query = '*[_type == "comuna"]{name}';
      const result = await cliente.fetch(query);
      const sortedCommunes = result.map(comuna => ({
        label: comuna.name,
        value: comuna.name
      })).sort((a, b) => a.label.localeCompare(b.label));
      setCommunes(sortedCommunes);
    };

    const fetchBarrels = async () => {
      const query = '*[_type == "barrilAdicional"]{name, price}';
      const result = await cliente.fetch(query);
      const sortedBarrels = result.map(barril => ({
        label: `${barril.name} - $${barril.price}`,
        value: barril.name,
        price: barril.price
      })).sort((a, b) => a.label.localeCompare(b.label));
      setBarrels(sortedBarrels);
    };

    fetchCommunes();
    fetchBarrels();
  }, []);

  const handleBarrelSelect = (value) => {
    if (value === null) {
      setSelectedProduct(null);
      setAdditionalBarrelPrice(0);
    } else {
      const selectedBarrel = barrels.find(barrel => barrel.value === value);
      setSelectedProduct(value);
      setAdditionalBarrelPrice(selectedBarrel ? selectedBarrel.price : 0);
    }
  };


 const handleFinalizarCompra = async () => {
    if (validateForm()) {
  
      const userId = auth.currentUser?.uid; // Obtener el ID del usuario actual
      if (!userId) {
        Alert.alert('Error', 'Debes estar autenticado para realizar una compra.');
        return; // Salir si no hay usuario autenticado
      }
  
      try {
        // Crear un objeto de datos de la compra
        const purchaseData = {
          userId: userId,
          address: formValues.address,
          phone: formValues.phone,
          city: formValues.selectedCity,
          date: formValues.selectedDate,
          time: formValues.selectedTime,
          items: cart.map(item => ({
            id: item._id,
            name: item.name,
            price: item.price,
            quantity: item.quantity
          })),
          total: total + (isBartenderService ? bartenderPrice : 0) + additionalBarrelPrice,
   
          createdAt: Timestamp.now() // Fecha y hora de creación
        };
  
        console.log("Datos de compra:", purchaseData); // Para depurar
  
        // Guardar datos en Firestore, usando un ID de documento generado automáticamente en la colección "facturacion"
        const facturacionRef = collection(db, "facturacion"); // Referencia a la colección

        await setDoc(doc(facturacionRef), purchaseData); // Esto generará un ID único para cada factura

        Alert.alert('Compra finalizada', '¡Gracias por tu compra!');
        onClose();
      } catch (error) {
        console.error("Error al procesar la compra:", error);
        Alert.alert('Error', `Ocurrió un error al procesar tu compra: ${error.message}`);
      }
    } else {
      Alert.alert('Error', 'Por favor, corrige los errores antes de continuar.');
    }
  };


  const formatCurrency = (amount) => {
    return amount.toLocaleString('es-ES', { style: 'currency', currency: 'CLP' });
  };

  return (
    <Modal
      isVisible={isVisible}
      onBackdropPress={onClose}
      swipeDirection="down"
      onSwipeComplete={onClose}
      style={{ justifyContent: 'flex-end', margin: 10 }}
    >
      <CustomKeyboardView>
        <View className="bg-white p-4 rounded-t-lg">

          {/* Dirección de Envio */}
          <Text className="text-lg font-semibold mb-4 pt-4">Dirección de Envio</Text>
          <View className="flex-row gap-2 justify-center">
            <TextInput
              ref={refs.addressRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Dirección de Envio'
              value={formValues.address}
              onChangeText={(value) => handleInputChange('address', value)}
            />
            <TextInput
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Número'
              value={formValues.houseNumber}
              onChangeText={(value) => handleInputChange('houseNumber', value)}
            />
            <View className="flex-1 rounded-lg bg-gray-100">
              <RNPickerSelect
                onValueChange={(value) => handleInputChange('selectedCity', value)}
                placeholder={{ label: 'Seleccionar Ciudad', value: null }}
                items={communes}
              />
            </View>
          </View>
          {errors.city && <Text style={{ color: 'red' }}>{errors.city}</Text>}

          {/* Teléfono */}
          <View className="pt-2 bg-white rounded-t-lg">
            <TextInput
              ref={refs.phoneRef}
              className="rounded-lg bg-gray-100 text-base p-2"
              placeholder='Telefono'
              value={formValues.phone}
              onChangeText={(value) => handleInputChange('phone', value)}
              keyboardType="phone-pad"
            />
          </View>
          {errors.phone && <Text style={{ color: 'red' }}>{errors.phone}</Text>}

          {/* Servicio de Bartender */}
          <View className="pt-6 flex-row items-center justify-between">
            <View className="flex-col">
              <Text className="text-lg font-semibold">* Servicio de Bartender</Text>
              <Text className="text-base font-normal pl-4"> Precio {formatCurrency(bartenderPrice)} (Opcional)</Text>
            </View>
            <CheckBox
              checked={isBartenderService}
              onPress={() => setIsBartenderService(!isBartenderService)}
            />
          </View>

          {/* Barril Adicional */}
          <View className="pt-6 flex-col">
            <Text className="text-lg font-semibold">* Seleccionar Barril adicional </Text>
            <Text className="text-base font-normal pl-4">Servicio (Opcional)</Text>
            <View className="rounded-lg bg-gray-100 mt-2">
              <RNPickerSelect
                onValueChange={handleBarrelSelect}
                value={selectedProduct}
                placeholder={{ label: 'Ningún barril adicional', value: null }}
                items={barrels}
              />
            </View>
          </View>

          {/* Horario de Envio */}
          <View className="pt-6 flex-col">
            <Text className="text-lg font-semibold">Horario de Envio</Text>
            <View className="flex-row pt-2 justify-center">
              <View style={{ margin: 5 }}> 
                <DateTimeSelector
                  mode="date"
                  label="Seleccionar Fecha"
                  onConfirm={(value) => handleInputChange('selectedDate', value)}
                />
              </View>
              <View style={{ margin: 5 }}> 
                <DateTimeSelector
                  mode="time"
                  label="Seleccionar Hora"
                  onConfirm={(value) => handleInputChange('selectedTime', value)}
                />
              </View>
            </View>
          </View>
          {errors.date && <Text style={{ color: 'red' }}>{errors.date}</Text>}
          {errors.time && <Text style={{ color: 'red' }}>{errors.time}</Text>}

          {/* Facturación */}
          <View className="border rounded-lg p-4 mt-8">
            <Text className="text-lg font-semibold mb-4">Facturación</Text>
            {cart.map((item) => (
              <View key={item._id} className="flex-row justify-between mb-2">
                <Text>{item.name}</Text>
                <Text>{formatCurrency(item.price * item.quantity)}</Text>
              </View>
            ))}
            {isBartenderService && (
              <View className="flex-row justify-between mb-2">
                <Text>Servicio de Bartender</Text>
                <Text>{formatCurrency(bartenderPrice)}</Text>
              </View>
            )}
            {additionalBarrelPrice > 0 && (
              <View className="flex-row justify-between mb-2">
                <Text>Barril Adicional</Text>
                <Text>{formatCurrency(additionalBarrelPrice)}</Text>
              </View>
            )}
            <View className="flex-row justify-between mt-4 border-t pt-2">
              <Text className="font-semibold">Total</Text>
              <Text className="font-semibold">{formatCurrency(total + (isBartenderService ? bartenderPrice : 0) + additionalBarrelPrice)}</Text>
            </View>
          </View>

          {/* Botón Finalizar */}
          <Button
            mode="contained"
            onPress={handleFinalizarCompra}
            style={{ marginTop: 40 }}
          >
            Finalizar Compra
          </Button>
        </View>
      </CustomKeyboardView>
    </Modal>
  );
};

export default ResumenModal;
