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

  const validateEmail = (email) => /\S+@\S+\.\S+/.test(email);

  const handleLogin = async () => {
    let validationErrors = {};

    if (!emailRef.current) validationErrors.email = "Please enter your email";
    else if (!validateEmail(emailRef.current)) validationErrors.email = "Please enter a valid email address";

    if (!passwordRef.current) validationErrors.password = "Please enter your password";

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
            errorMessage = "Incorrect password. Please try again.";
            setErrors({ password: errorMessage });
            break;
          case 'auth/user-not-found':
            errorMessage = "No user found with this email.";
            setErrors({ email: errorMessage });
            break;
          default:
            errorMessage = response.message || "An error occurred during login.";
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

      {/* Alert component */}
      {alertMessage ? (
        <Alert 
          message={alertMessage} 
          onDismiss={() => setAlertMessage('')} 
        />
      ) : null}

      <View style={{ paddingTop: hp(7), paddingHorizontal: wp(4) }} className="flex-1">
        
        {/* SignIn image */}
        <View className="items-center">
          <Image 
            style={{ height: hp(30) }}
            resizeMode="contain"
            source={require('../assets/Imagenes-new/login.png')} 
          />
        </View>

        <View className="gap-y-2"> 
          <Text style={{ fontSize: hp(4) }} className="font-bold tracking-wider text-center text-neutral-800">
            Sign In
          </Text>

          {/* Inputs */}
          <View className="gap-y-4">
            <View 
              style={{ height: hp(7) }} 
              className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
              <Octicons name="mail" size={hp(2.7)} />
              <TextInput
                onChangeText={value => {
                  emailRef.current = value;
                  if (errors.email) setErrors(prev => ({ ...prev, email: "" }));
                }}
                style={{ fontSize: hp(2) }}
                className="flex-1 font-semibold text-neutral-700"
                placeholder="Email address"
                placeholderTextColor="gray"
              />
            </View>

            <View className="gap-y-1.5">
              <View 
                style={{ height: hp(7) }} 
                className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="lock" size={hp(2.7)} />
                <TextInput
                  onChangeText={value => {
                    passwordRef.current = value;
                    if (errors.password) setErrors(prev => ({ ...prev, password: "" }));
                  }}
                  style={{ fontSize: hp(2) }}
                  className="flex-1 font-semibold text-neutral-700"
                  placeholder="Password"
                  secureTextEntry
                  placeholderTextColor="gray"
                />
              </View>
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-right text-neutral-500">
                Forgot password?
              </Text>
            </View>

            {/* Submit button */}
            <View>
              {loading ? (
                <View className="flex-row justify-center">
                  <Loading size={hp(8)}/>
                </View>
              ) : (
                <TouchableOpacity 
                  onPress={handleLogin} 
                  style={{ height: hp(6.5) }} 
                  className="bg-indigo-500 rounded-xl justify-center items-center">
                  <Text style={{ fontSize: hp(2.7) }} className="text-white font-bold tracking-wider">
                    Sign In
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            {/* General Error */}
            {errors.general && (
              <Text style={{ fontSize: hp(1.8), color: 'red', textAlign: 'center' }}>{errors.general}</Text>
            )}

            {/* Sign up text */}
            <View className="flex-row justify-center">
              <Text style={{ fontSize: hp(1.8) }} className="font-semibold text-neutral-500">
                Don't have an account?
              </Text>
              <Pressable onPress={() => router.push('signUp')}>
                <Text style={{ fontSize: hp(1.8) }} className="font-bold text-indigo-500">
                  Sign Up
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
