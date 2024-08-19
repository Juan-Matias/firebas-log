import { View, Text, Button, Pressable } from 'react-native';
import React from 'react';
import { useAuth } from '../../context/authContext';

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
      <Text>Home</Text>
      <Button title="Sign Out" onPress={handleLogout} /> 

    </View>
  );
}
