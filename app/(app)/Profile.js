import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { heightPercentageToDP as hp } from "react-native-responsive-screen";
import { Avatar } from "react-native-paper";
import {
  Ionicons,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../../context/authContext"; // Asumiendo que manejas tu contexto de autenticación
import { useNavigation } from "@react-navigation/native";
import Alert from "../../components/alerts/Alert";

const ProfileScreen = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [profileUrl, setProfileUrl] = useState(
    "https://via.placeholder.com/150"
  ); // Imagen por defecto
  const [isEditingName, setIsEditingName] = useState(false); // Nuevo estado para manejar la edición del nombre
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const navigation = useNavigation();
  const {
    user,
    logout,
    updateUserName,
    updateUserPassword,
    refreshUserData,
    reauthenticateUser,
    updateUserPhone,
  } = useAuth(); // Obtenemos el usuario del contexto

  // Efecto para establecer el nombre y email del usuario autenticado
  useEffect(() => {
    if (user) {
      setUsername(user.username || "Prueba"); // Nombre del usuario o "Usuario Invitado"
      setEmail(user.email || "Prueba@example.com"); // Email del usuario o uno por defecto
      setTelefono(user.telefono || "Agregar Telefono");
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
      setIsEditingName(false); // Oculta el campo de texto después de guardar
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
        setCurrentPassword("");
        setNewPassword("");
        setIsEditingPassword(false);
      } else {
        alert(`Error: ${result.message}`);
      }
    } else {
      alert(`Error al re-autenticar: ${reauthResult.message}`);
    }
  };

  // Función para actualizar el teléfono
  const handlePhoneChange = async () => {
    const result = await updateUserPhone(telefono);
    if (result.success) {
      await refreshUserData();
      setIsEditingPhone(false);
      alert("Teléfono actualizado con éxito.");
    } else {
      alert(result.message || "Error al actualizar el teléfono.");
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
  const handleSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View className="flex-1 justify-start items-center pt-4 bg-white ">
      {/* Imagen de avatar y detalles */}
      {user && !user.isAnonymous && (
        <>
          <View style={{ position: "relative", marginBottom: 10 }}>
            {/* Sección de Avatar */}

            <Avatar.Image
              size={100}
              source={{ uri: profileUrl }}
              style={{ marginRight: 10 }}
            />

            {/* Sección de botón cambiar imagen */}
            <TouchableOpacity
              onPress={handleImagePicker}
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "white",
                borderRadius: 15,
                padding: 5,
              }}
            >
              <MaterialIcons name="photo-camera" size={hp(2.7)} color="gray" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-start items-center mb-4 bg-gray-100 rounded-lg shadow-md p-4">
            {/* Sección de nombre del usuario */}

            <View className="w-52">
              <View className="flex-row justify-between">
                {isEditingName ? (
                  // Campo de texto para editar el nombre
                  <TextInput
                    className="border-b border-gray-300 flex-1"
                    placeholder="Nuevo nombre de usuario"
                    value={username}
                    onChangeText={setUsername}
                    autoFocus
                  />
                ) : (
                  // Texto que muestra el nombre
                  <>
                    <MaterialCommunityIcons
                      name={"account"}
                      size={hp(2.7)}
                      color="gray"
                    />
                    <Text className="text-lg font-bold ">{username}</Text>
                  </>
                )}

                {/* Botón para editar el nombre */}
                <TouchableOpacity
                  onPress={() => setIsEditingName(!isEditingName)}
                >
                  <MaterialCommunityIcons
                    name={isEditingName ? "check" : "pencil-outline"}
                    size={hp(2.7)}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>

              {/* Mostrar botón de guardar solo si se está editando el nombre */}
              {isEditingName && (
                <TouchableOpacity
                  onPress={handleUsernameChange}
                  className="bg-blue-500 px-2 py-2 rounded-full mb-4 mt-3"
                >
                  <Text className="text-white text-center">Guardar Nombre</Text>
                </TouchableOpacity>
              )}

              {/* Seccion - Agregar Telefono*/}

              <View className="flex-row justify-between">
                {isEditingPhone ? (
                  // Campo de texto para editar el nombre
                  <TextInput
                    className="border-b border-gray-300 flex-1"
                    placeholder="Nuevo nombre de usuario"
                    value={telefono}
                    onChangeText={setTelefono}
                    autoFocus
                  />
                ) : (
                  <>
                    <MaterialCommunityIcons
                      name={"phone"}
                      size={hp(2.7)}
                      color="gray"
                    />
                    <Text className="text-lg font-bold ">{telefono}</Text>
                  </>
                )}

                {/* Botón para editar el nombre */}
                <TouchableOpacity
                  onPress={() => setIsEditingPhone(!isEditingPhone)}
                >
                  <MaterialCommunityIcons
                    name={isEditingPhone ? "check" : "pencil-outline"}
                    size={hp(2.7)}
                    color="gray"
                  />
                </TouchableOpacity>
              </View>
              {/* Mostrar botón de guardar solo si se está editando numero telefon   */}
              {isEditingPhone && (
                <TouchableOpacity
                  onPress={handlePhoneChange}
                  className="bg-blue-500 px-2 py-2 rounded-full mb-4 mt-3"
                >
                  <Text className="text-white text-center">Guardar Numero</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View className="flex-row justify-start items-center mb-4 bg-gray-100 rounded-lg shadow-md p-4">
            <MaterialCommunityIcons
              name={"email"}
              size={hp(2.7)}
              color="gray"
            />
            <View style={{ position: "relative" }}></View>
            <Text className="text-lg font-bold ">{"  " + email}</Text>
          </View>

          {/* Seccion Btn cambiar contraseña */}
          <View className="flex justify-between mb-4 bg-gray-100 rounded-md shadow-md p-4">
            <TouchableOpacity
              className="flex-row items-center" // Agrega flex-row para alinear en fila y items-center para alinear verticalmente
              onPress={() => setIsEditingPassword(!isEditingPassword)}
            >
              <Text className="text-lg font-bold mr-2">Cambiar Contraseña</Text>
              {/* Espacio a la derecha del texto */}
              <MaterialCommunityIcons
                name={isEditingPassword ? "check" : "pencil-outline"}
                size={hp(2.7)}
                color="gray"
              />
            </TouchableOpacity>

            {isEditingPassword && (
              <>
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
                  <Text className="text-white text-center">
                    Cambiar Contraseña
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Campos para actualizar contraseña */}

          {/* Botón de cerrar sesión */}
          <TouchableOpacity
            style={{ margin: hp(5) }}
            className="bg-amber-500 px-6 py-3 w-80 rounded-xl"
            onPress={handleLogout}
          >
            <Text className="text-white text-lg text-center">
              Cerrar Sesión
            </Text>
          </TouchableOpacity>
        </>
      )}

      {user.isAnonymous && (
        <>
          <Image
            style={{ width: 200, height: 200, marginTop: 30 }}
            source={require("../../assets/Imagenes-new/padlock.png")}
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-zinc-700 mt-5 ">
            ¡Ups! Debes registrarte para poder ver tu perfil...
          </Text>
          {/*  Boton te devuelve a el registro de usuario  */}
          <TouchableOpacity
            className="bg-amber-500 px-6 py-3 w-72 rounded-full mb-4 mt-32"
            onPress={handleSignUp}
          >
            <Text className="text-lg text-center">Registrarse</Text>
          </TouchableOpacity>
          {/*  Boton de cierre de sesion */}
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
