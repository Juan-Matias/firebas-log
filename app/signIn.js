import { View, Text, Image, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';
import Alert from '../components/alert.js';

export default function SignIn() {
  const router = useRouter();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [alertMessage, setAlertMessage] = useState('');

  const emailRef = useRef("");
  const passwordRef = useRef("");
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Funciones de validación
  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    let validationErrors = {};

    if (!emailRef.current) {
      validationErrors.email = "Por favor, ingresa su correo";
      emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
    } else if (!validateEmail(emailRef.current)) {
      validationErrors.email = "Por favor, ingresa un correo válido";
      emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
    }

    if (!passwordRef.current) {
      validationErrors.password = "Por favor, ingresa tu contraseña";
      if (!validationErrors.email) passwordInputRef.current?.focus(); // Enfoca el campo de contraseña si no hay error en el email
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlertMessage(Object.values(validationErrors).join('\n'));
      return;
    }

    setLoading(true);

    try {
      const response = await login(emailRef.current, passwordRef.current);

      if (response.success) {
        router.push('/home');
      } else {
        let errorMessage = '';
        switch(response.message) {
          case 'auth/wrong-password':
            errorMessage = "Contraseña incorrecta. Por favor, inténtalo de nuevo.";
            setErrors({ password: errorMessage });
            passwordInputRef.current?.focus(); // Enfoca el campo de contraseña
            break;
          case 'auth/user-not-found':
            errorMessage = "No se encontró un usuario con este correo electrónico.";
            setErrors({ email: errorMessage });
            emailInputRef.current?.focus(); // Enfoca el campo de correo electrónico
            break;
          default:
            errorMessage = response.message || "Ocurrió un error durante el inicio de sesión.";
            setErrors({ general: errorMessage });
            break;
        }
        setAlertMessage(errorMessage);
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

      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(4) }} className="flex-1">
        
        {/* Imagen de SignIn */}
        <View className="items-center">
          <Image 
            style={{ height: hp(30) }}
            resizeMode="contain"
            source={require('../assets/Imagenes-new/login.png')} 
          />
        </View>

        <View className="gap-y-2"> 
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
            Iniciar sesión
          </Text>

          {/* Inputs */}
          <View className="gap-y-4">
            <View 
              style={{ height: hp(7) }} 
              className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="mail" size={hp(2.7)} />
              <TextInput
                ref={emailInputRef}
                onChangeText={value => {
                  emailRef.current = value;
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Correo electrónico"
                placeholderTextColor="gray"
              />
            </View>

            <View className="gap-y-1.5">
              <View 
                style={{ height: hp(7) }} 
                className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="lock" size={hp(2.7)} />
                <TextInput
                  ref={passwordInputRef}
                  onChangeText={value => {
                    passwordRef.current = value;
                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Contraseña"
                  secureTextEntry
                  placeholderTextColor="gray"
                />
              </View>
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-right text-neutral-500">
                ¿Olvidaste tu contraseña?
              </Text>
            </View>

            {/* Botón de envío */}
              <TouchableOpacity 
                onPress={handleLogin} 
                style={{ height: hp(6.5), backgroundColor: '#E8A500' }} // Aquí cambiamos el color de fondo
                className="rounded-xl justify-center items-center"
              >
                <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                  Iniciar sesión
                </Text>
              </TouchableOpacity>


            {/* Error general */}
            {errors.general && (
              <Text style={{ fontSize: hp(1.8), color: 'red', textAlign: 'center' }}>{errors.general}</Text>
            )}

            {/* Texto de registro */}
            <View className="flex-row justify-center gap-x-2">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500 ">
                ¿No tienes una cuenta?
              </Text>
              <Pressable onPress={() => router.push('signUp')}>
                <Text style={{ fontSize: hp(2) }} className="font-bold text-amber-600 ">
                  Regístrate
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
