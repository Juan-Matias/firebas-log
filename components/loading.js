import { View, Text } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native';


export default function Loading({ size}) {
    return (
      <View style={{ height: size, aspectRatio: 2 }}>
        <LottieView 
          style={{ flex: 1 }} 
          source={require('../assets/Imagenes-new/Loaging/Loading2.json')} 
          autoPlay 
          loop 
        />
      </View>
    );
  }
  