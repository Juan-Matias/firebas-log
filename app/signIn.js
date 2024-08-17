import { View, Text, Image, TextInput, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useRef } from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';  // Asegúrate de importar estas funciones si es necesario
import { Octicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// 7:52
export default function SignIn() {
  const router = useRouter();
  
  const emailRef = useRef("");
  const passwordRef = useRef("");

  const handleLogin = async()=>{
    if (!emailRef.current || !passwordRef.current) {
      Alert.alert("Sign In", "Please fill al the fields");
      return;
    }
    // login process
  }

  return (
    <View className="flex-1">
      <StatusBar style="dark"/>
      
      <View 
        style={{ paddingTop: hp(7),
        paddingHorizontal: wp(4) }}
        className="flex-1 ">
          
          {/* signIn image */}
          <View className="items-center">
            <Image style={{ height: hp(30) }}
            resizeMode='contain'
            source={require('../assets/Imagenes-new/login.png')}/>
          </View>

            {/*className="gap-10"*/}
          <View className="gap-y-2"> 
            <Text style={{fontSize:hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">
              Sign In
          </Text>

             {/* Inputs */}
             <View className="gap-y-4 gap-x-2">

             <View style={{height:hp(7)}} className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="mail" size={hp(2.7)} />
                <TextInput
                  onChangeText={value=> emailRef.current=value}
                  style={{fontSize:hp(2)}}
                  className="flex-1 font-semibold text-neutral-700 "
                  placeholder='Email addres'
                  placeholderTextColor={'gray'}
                  />
             </View>

           <View className="gap-x-0.5 gap-y-1.5">

           
             <View style={{height:hp(7)}} className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="lock" size={hp(2.7)} />
                <TextInput
                  onChangeText={value=> passwordRef.current=value}
                  style={{fontSize:hp(2)}}
                  className="flex-1 font-semibold text-neutral-700 "
                  
                  placeholder='Password'
                  secureTextEntry
                  placeholderTextColor={'gray'}
                  />
             </View>
              <Text style={{fontSize:hp(1.8)}} className="font-semibold text-right text-neutral-500">
                Forgot password?
              </Text>
             </View>

             {/* submit button*/}
             <TouchableOpacity onPress={handleLogin} style={{height:hp(6.5)}} className="bg-indigo-500 rounded-xl justify-center items-center">
              <Text style={{fontSize:hp(2.7)}} className="text-white font-bold tracking-wider">
                Sign In
              </Text>
             </TouchableOpacity>

              {/* sign up text*/}
              <View className="flex-row justify-center">
                <Text style={{fontSize:hp(1.8)}} className="font-semibold text-neutral-500"> Don't have an account?</Text>
                
                <Pressable onPress={()=>router.push('signUp')}>
                <Text style={{fontSize:hp(1.8)}} className="font-bold text-indigo-500"> Sign Up</Text>
                </Pressable>
                
              </View>
             </View>
           

          </View>
      </View>
    </View>
  )
}
