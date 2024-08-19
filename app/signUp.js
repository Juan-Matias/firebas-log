import { View, Text, Image, TextInput, TouchableOpacity, Pressable } from 'react-native';
import React, { useRef, useState } from 'react';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { StatusBar } from 'expo-status-bar';
import { Octicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Loading from '../components/loading';
import CustomKeyboardView from '../components/CustomKeyboardView';
import { useAuth } from '../context/authContext';

export default function SignIn() {
  const router = useRouter();
  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const refs = {
    email: useRef(""),
    username: useRef(""),
    telefono: useRef(""),
    password: useRef(""),
    passConfirmacion: useRef("")
  };

  const validations = {
    email: value => value ? "" : "Please enter your email",
    username: value => value ? "" : "Ingrese su nombre completo",
    telefono: value => /^\d+$/.test(value) ? "" : "Please enter a valid phone number",
    password: value => value ? "" : "Please enter your password",
    passConfirmacion: value => value === refs.password.current ? "" : "Passwords do not match"
  };

  const handleRegister = async () => {
    let validationErrors = {};

    for (const key in refs) {
      const value = refs[key].current;
      const errorMessage = validations[key](value);
      if (errorMessage) validationErrors[key] = errorMessage;
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const response = await register(refs.email.current, refs.password.current, 'defaultProfileUrl');

      if (response.success) {
        router.push('/signIn');
      } else {
        setErrors({ general: response.message || "An error occurred during registration." });
      }
    } catch (error) {
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomKeyboardView>
      <StatusBar style="dark" />
      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(4) }} className="flex-1">
        
        {/* signIn image */}
        <View className="items-center">
          <Image 
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require('../assets/Imagenes-new/register.png')} 
          />
        </View>

        <View className="gap-y-2"> 
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
            Sign Up
          </Text>

          {/* Inputs */}
          <View className="gap-y-4">
            {Object.keys(refs).map((key, index) => (
              <View key={index}>
                <View 
                  style={{ height: hp(7) }} 
                  className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                  <Feather name={key === "username" ? "user" : key === "telefono" ? "phone" : key.includes("password") ? "lock" : "mail"} size={hp(2.7)} />
                  <TextInput
                    onChangeText={value => {
                      refs[key].current = value;
                      if (errors[key]) setErrors(prev => ({ ...prev, [key]: "" }));
                    }}
                    style={{ fontSize: hp(2) }}
                    className="flex-1 font-semibold text-neutral-800"
                    placeholder={errors[key] ? errors[key] : key === "username" ? "Nombre Completo" : key === "telefono" ? "Telefono" : key === "email" ? "Correo" : key === "password" ? "Contraseña" : "Confirmar Contraseña"}
                    placeholderTextColor={errors[key] ? "#FF5733" : "gray"}
                    secureTextEntry={key.includes("password")}
                  />
                </View>
              </View>
            ))}

            {/* Submit Button */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)} />
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={handleRegister} 
                  style={{ height: hp(6.5) }} 
                  className="bg-indigo-500 rounded-xl justify-center items-center">
                  <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                    Sign Up
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* General Error */}
            {errors.general && (
              <Text style={{ fontSize: hp(1.8), color: 'red', textAlign: 'center' }}>{errors.general}</Text>
            )}

            {/* Sign Up Text */}
            <View className="flex-row justify-center">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                Already have an account?
              </Text>
              <Pressable onPress={() => router.push('signIn')}>
                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-indigo-500">
                  Sign In
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </CustomKeyboardView>
  );
}
