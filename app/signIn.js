import { View, Text, Image, TextInput } from 'react-native'
import React from 'react'
import { StatusBar } from 'expo-status-bar'
import { heightPercentageToDP as hp, widthPercentageToDP as wp} from 'react-native-responsive-screen';  // Asegúrate de importar estas funciones si es necesario
import { Octicons } from '@expo/vector-icons';

// 7:52


export default function SignIn() {
  return (
    <View className="flex-1">
      <StatusBar style="dark"/>
      
      <View 
        style={{ paddingTop: hp(8),
        paddingHorizontal: wp(5) }}
        className="flex-1">
          
          
          {/* signIn image */}
          <View className="items-center">
            <Image style={{ height: hp(30) }}
            resizeMode='contain'
            source={require('../assets/Imagenes-new/login.png')}/>
          </View>

            {/*className="gap-10"*/}
          <View className="gap-5"> 
            <Text style={{fontSize:hp(4)}} className="font-bold tracking-wider text-center text-neutral-800">
              Sign In
          </Text>
             {/* Inputs */}
             <View style={{height:hp(7)}} className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="mail" size={hp(2.7)} />
                <TextInput
                  style={{fontSize:hp(2)}}
                  className="flex-1 font-semibold text-neutral-700 "
                  placeholder='Email addres'
                  placeholderTextColor={'gray'}
                  />
             </View>

             <View style={{height:hp(7)}} className="flex-row gap-x-2 px-3 bg-neutral-100 items-center rounded-2xl">
                <Octicons name="mail" size={hp(2.7)} />
                <TextInput
                  style={{fontSize:hp(2)}}
                  className="flex-1 font-semibold text-neutral-700 "
                  placeholder='Password'
                  placeholderTextColor={'gray'}
                  />
             </View>

          </View>
      </View>
    </View>
  )
}
