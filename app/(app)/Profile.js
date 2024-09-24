import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar } from "react-native-paper";


import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/authContext"; // Asumiendo que manejas tu contexto de autenticación
import { useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState(
    "https://via.placeholder.com/150"
  ); // Imagen por defecto
  const navigation = useNavigation();
  const {
    user,
    logout,
    updateUserName,
    updateUserPassword,
    refreshUserData,
    reauthenticateUser,
  } = useAuth(); // Obtenemos el usuario del contexto

  // Efecto para establecer el nombre y email del usuario autenticado
  useEffect(() => {
    if (user) {
      setUsername(user.username || "Prueba"); // Nombre del usuario o "Usuario Invitado"
      setEmail(user.email || "Prueba@example.com"); // Email del usuario o uno por defecto
    }
  }, [user]);

  // Función para elegir imagen
  const handleImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Lo siento, necesitamos permiso para acceder a tu galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setProfileUrl(result.uri); // Establecer nueva imagen de perfil
    }
  };

  const handleUsernameChange = async () => {
    const result = await updateUserName(username); // Función que actualiza el nombre
    if (result.success) {
      await refreshUserData(); // Llamada a la función para recargar los datos del usuario
      alert("Nombre de usuario actualizado");
    } else {
      alert(`Error: ${result.message}`);
    }
  };

  // Función para cambiar la contraseña
  const handlePasswordChange = async () => {
    // Primero, re-autenticar al usuario
    const reauthResult = await reauthenticateUser(email, currentPassword);
    if (reauthResult.success) {
      // Si la re-autenticación es exitosa, proceder con el cambio de contraseña
      const result = await updateUserPassword(newPassword);
      if (result.success) {
        alert("Contraseña actualizada");
      } else {
        alert(`Error: ${result.message}`);
      }
    } else {
      alert(`Error al re-autenticar: ${reauthResult.message}`);
    }
  };

  // Función para cerrar sesión
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error durante el cierre de sesión:", error);
    }
  };
  // Función para ir al registro
  const handleSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View className="flex-1 justify-start items-center p-4 bg-white">
      {/* Imagen de avatar y detalles */}

      {/* Botones y campos de entrada */}
      {user && !user.isAnonymous && (
        <>
          <View className="flex-row justify-start items-center mb-4 bg-gray-100 h-32 w-80 rounded-lg shadow-md p-4">
            <Avatar.Image
              size={70}
              source={{ uri: profileUrl }}
              style={{ marginRight: 10 }}
            />
            <View>
              <Text className="text-lg font-bold">{username}</Text>
              <Text className="text-base font-semibold text-zinc-600">
                {email}
              </Text>
            </View>
          </View>
          <TextInput
            className="w-80 p-3 border border-gray-300 rounded-lg text-center mb-4"
            placeholder="Actualizar nombre de usuario"
            value={username}
            onChangeText={setUsername}
          />
          <TouchableOpacity
            onPress={handleUsernameChange}
            className="bg-blue-500 px-6 py-3 rounded-full mb-4"
          >
            <Text className="text-white text-center">Guardar Nombre</Text>
          </TouchableOpacity>

          {/* Campos para actualizar contraseña */}
          <TextInput
            className="w-80 p-3 border border-gray-300 rounded-lg text-center mb-4"
            placeholder="Contraseña actual"
            value={currentPassword}
            onChangeText={setCurrentPassword}
            secureTextEntry
          />
          <TextInput
            className="w-80 p-3 border border-gray-300 rounded-lg text-center mb-4"
            placeholder="Nueva contraseña"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TouchableOpacity
            onPress={handlePasswordChange}
            className="bg-blue-500 px-6 py-3 rounded-full mb-4"
          >
            <Text className="text-white text-center">Cambiar Contraseña</Text>
          </TouchableOpacity>

          {/* Botón de cerrar sesión */}
          <TouchableOpacity
            style={{ margin: hp(10) }}
            className="bg-amber-500 px-6 py-3 w-80 rounded-full"
            onPress={handleLogout}
          >
            <Text className="text-lg text-center">Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      )}

      {user.isAnonymous && (
        <>
          <Image
            style={{ width: 200, height: 200, marginTop: hp(10) }}
            source={require("../../assets/Imagenes-new/padlock.png")}
            className="w-72 h-72"
            resizeMode="contain"
          />
          <Text
            style={{ paddingTop: hp(5) }}
            className="text-2xl font-bold text-zinc-700 "
          >
            ¡Ups! debes registrarte para poder ver tu pefil...
          </Text>
          {/* Botón de cerrar sesión */}
          <TouchableOpacity
            style={{ margin: hp(3) }}
            className="bg-amber-500 px-6 py-3 w-72 rounded-full"
            onPress={handleSignUp}
          >
            <Text className="text-lg text-center">Registrarse</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-amber-500 px-6 py-3 w-72 rounded-full"
            onPress={handleLogout}
          >
            <Text className="text-lg text-center">Cerrar Sesión</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default ProfileScreen;