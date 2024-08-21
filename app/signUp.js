import { View, Text, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/loading';
// import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import Alert from '../components/alert.js';

export default function SignUp() {
  const router = useRouter();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  // Referencias para los inputs
  const refs = {
    username: useRef(null),
    email: useRef(null),
    telefono: useRef(null),
    password: useRef(null),
    passConfirmacion: useRef(null),
  };

  // Validaciones de los inputs
  const validations = {
    email: value => /\S+@\S+\.\S+/.test(value) ? "" : "Please enter a valid email address",
    username: value => value ? "" : "Ingrese su nombre completo",
    telefono: value => /^\d+$/.test(value) ? "" : "Please enter a valid phone number",
    password: value => value ? "" : "Please enter your password",
    passConfirmacion: value => value === refs.password.current?.value ? "" : "Passwords do not match",
  };

  // Manejo del registro
  const handleRegister = async () => {
    let validationErrors = {};
    let firstErrorKey = null;

    // Validar los campos y capturar el primer error
    for (const key in refs) {
      const value = refs[key].current?.value;
      const errorMessage = validations[key](value);
      if (errorMessage) {
        validationErrors[key] = errorMessage;
        if (!firstErrorKey) firstErrorKey = key; // Captura la primera clave con error
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlertMessage("Todos los campos son obligatorios");

      // Enfocar el primer campo con error
      if (firstErrorKey && refs[firstErrorKey].current) {
        refs[firstErrorKey].current.focus();
      }

      return;
    }

    setLoading(true);

    try {
      const response = await register(refs.email.current.value, refs.password.current.value, 'defaultProfileUrl');

      if (response.success) {
        router.push('/signIn');
      } else {
        setAlertMessage(response.message || "An error occurred during registration.");
        setErrors({ general: response.message || "An error occurred during registration." });
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="dark" />

      {/* Componente de alerta */}
      {alertMessage ? (
        <Alert 
          message={alertMessage} 
          onDismiss={() => setAlertMessage('')} 
        />
      ) : null}

      <View style={{ paddingTop: hp(15), paddingHorizontal: wp(5) }} className="flex-1">
        
        {/* Imagen de registro */}
        <View className="gap-y-8">
          
          {/* Títulos */}
          <View>
            <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
              Registrarse
            </Text>
            <Text style={{ fontSize: hp(2) }} className="font-semibold tracking-wider text-center text-neutral-600">
              Crea una cuenta nueva
            </Text>
          </View>

          {/* Inputs */}
          <View className="gap-y-4">
            {Object.keys(refs).map((key, index) => (
              <View key={index}>
                <View 
                  style={{ height: hp(7) }} 
                  className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                  
                  <Feather 
                    name={
                      key === "username" ? "user" :
                      key === "telefono" ? "phone" :
                      key.includes("password") ? "lock" : "mail"
                    } 
                    size={hp(2.7)} 
                  />
                  
                  <TextInput
                    ref={refs[key]}
                    onChangeText={value => {
                      refs[key].current.value = value;
                      if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
                    }}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-800"
                    placeholder={
                      key === "username" ? "Nombre Completo" :
                      key === "telefono" ? "Teléfono" :
                      key === "email" ? "Correo" :
                      key === "password" ? "Contraseña" : "Confirmar Contraseña"
                    }
                    placeholderTextColor="gray"
                    secureTextEntry={key.includes("password")}
                  />
                </View>
              </View>
            ))}

            {/* Botón de registro */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity 
                onPress={handleRegister} 
                style={{ height: hp(6.5), backgroundColor: '#E8A500' }} // Aquí cambiamos el color de fondo
                className="rounded-xl justify-center items-center"
              >
                <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                  Registrarse
                </Text>
              </TouchableOpacity>
              )} 
              
            </View>

            {/* Error general */}
            {errors.general && (
              <Text style={{ fontSize: hp(1.8), color: 'red', textAlign: 'center' }}>
                {errors.general}
              </Text>
            )}

            {/* Texto de Sign In */}
            <View className="flex-row justify-center gap-x-2">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                ¿Ya tienes una cuenta?
              </Text>
              <Pressable onPress={() => router.push('signIn')}>
                <Text style={{ fontSize: hp(2) }} className="font-bold text-amber-600">
                  Iniciar sesión
                </Text>
              </Pressable>

            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
