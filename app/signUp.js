import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Pressable, Animated } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Feather, Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/loading';
import Alert from '../components/alert.js';
import useSignUpLogic from '../hooks/login/useSignUpLogic'; // Importa el hook de lógica
import CustomKeyboardView from '../components/CustomKeyboardView.js';

// [ Registrarse ]
export default function SignUp() {
  const {
    refs,
    errors,
    setErrors,
    loading,
    alertMessage,
    setAlertMessage,
    handleRegister,
  } = useSignUpLogic(); // Usa el hook de lógica

  const router = useRouter();
  const opacity = new Animated.Value(1);

  // [Estado para la visibilidad de las contraseñas]
  const [passwordShown, setPasswordShown] = useState({
    password: false,
    confirmPassword: false,
  });

  // Función para alternar la visibilidad de las contraseñas
  const togglePasswordVisibility = (field) => {
    setPasswordShown((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // [Sección diseño]
  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />

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
                      key.includes("password") ? "lock" : "lock"
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
                    secureTextEntry={key.includes("password") && !passwordShown[key]}
                  />
                  
                  {/* Botón para mostrar/ocultar contraseñas */}
                  {key.includes("password") && (
                    <TouchableOpacity onPress={() => togglePasswordVisibility(key)}>
                      <Octicons 
                        name={passwordShown[key] ? "eye" : "eye-closed"} 
                        size={hp(2.7)} 
                        color="gray" 
                      />
                    </TouchableOpacity>
                  )}
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

            {/* Componente de alerta */}
            <View style={{ paddingTop: hp(3) }}>
              {alertMessage ? (
                <Alert
                  style={{ opacity }} 
                  message={alertMessage} 
                  onDismiss={() => setAlertMessage('')}
                />
              ) : null}
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
