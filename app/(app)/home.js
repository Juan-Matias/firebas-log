import { View, Text, Button, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '../../context/authContext';
import ColorList from '../../components/ColorList';

export default function Home() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <View>
      <ColorList color="#0891b2"/>
      <Button title="Sign Out" onPress={handleLogout} /> 
     

    </View>
  );
}
