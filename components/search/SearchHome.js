import React from 'react';
import { View, TextInput, Text } from 'react-native';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

const SearchHome = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={{ paddingTop: hp(2) }}>
      {/* Search bar */}
      <View className="flex-row items-center space-x-2 px-4 ">
        <View className="flex-row flex-1 items-center p-2.5 rounded-full border border-gray-300">
          {/* Icono de búsqueda */}
          <Feather name="search" size={22} color="gray" style={{ paddingLeft: 8 }} />
          
          {/* Input de búsqueda */}
          <TextInput
            placeholder="Buscar productos..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            className="ml-2 flex-1 font-normal text-zinc-700 text-base"
          />
        </View>
        
        {/* Icono de promociones */}
        <View className="flex-row p-2.5 rounded-full bg-amber-500 justify-center items-center w-26 ">
          <MaterialCommunityIcons name="star-circle-outline" size={30} color="white" />
          <Text className="p-1 text-white font-semibold text-sm">Promo</Text>
        </View>
      </View>
    </View>
  );
};

export default SearchHome;
