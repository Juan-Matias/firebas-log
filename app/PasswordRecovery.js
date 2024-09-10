import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth"; // Asegúrate de importar esto
import { auth } from "../Conection/FireBaseConection/firebaseConfig"; // Importa tu configuración de Firebase
import CustomKeyboardView from "../components/CustomKeyboardView"; // Si usas un componente para el teclado
import { heightPercentageToDP as hp } from "react-native-responsive-screen";

const PasswordRecovery = () => {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Por favor, ingrese su correo electrónico.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Éxito",
        "Se ha enviado un enlace de recuperación a su correo electrónico."
      );
      router.push("/signIn"); // Redirige al usuario al inicio de sesión después de enviar el correo
    } catch (error) {
      Alert.alert(
        "Error",
        error.message ||
          "Hubo un problema al intentar enviar el enlace de recuperación."
      );
    }
  };

  return (
    <CustomKeyboardView>
      <View
        style={{ paddingTop: hp(7), paddingHorizontal: hp(4) }}
        className="flex-1"
      >
        <View className="items-center" style={{ paddingTop: hp(10) }}>
          <Image
            style={{ height: hp(25) }}
            resizeMode="contain"
            source={require("../assets/Imagenes-new/Login1.png")}
          />
        </View>

        <Text
          style={{ fontSize: hp(4), paddingTop: hp(10) }}
          className="font-bold  text-center text-neutral-800"
        >
          Recuperar Contraseña
        </Text>
        <TextInput
          style={{ height: hp(7) }}
          className="border border-gray-300 p-2 my-5 rounded-xl"
          placeholder="Ingrese su correo electrónico"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          placeholderTextColor="gray"
        />
        <TouchableOpacity
          onPress={handleResetPassword}
          style={{ height: hp(6.5), backgroundColor: "#E8A500" }}
          className="rounded-xl justify-center items-center"
        >
          <Text
            style={{ fontSize: hp(2.7) }}
            className="text-white font-bold tracking-wider"
          >
            Enviar Enlace
          </Text>
        </TouchableOpacity>
      </View>
    </CustomKeyboardView>
  );
};

export default PasswordRecovery;
