import { useState, useRef } from 'react';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/authContext';

const useSignUpLogic = () => {
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Refs para manejar los valores y el enfoque de los campos de entrada
  const refs = {
    username: useRef(null),
    email: useRef(null),
    telefono: useRef(null),
    password: useRef(null),
    passConfirmacion: useRef(null),
  };

  const router = useRouter();
  const { register } = useAuth();

  // Validaciones de los inputs
  const validations = {
    email: value => /\S+@\S+\.\S+/.test(value) ? "" : "Please enter a valid email address",
    username: value => value ? "" : "Ingrese su nombre completo",
    telefono: value => /^\d+$/.test(value) ? "" : "Please enter a valid phone number",
    password: value => value ? "" : "Please enter your password",
    passConfirmacion: value => value === refs.password.current?.value ? "" : "Passwords do not match",
  };

  // Manejo del registro
  const handleRegister = async () => {
    let validationErrors = {};
    let firstErrorKey = null;

    // Validar los campos y capturar el primer error
    for (const key in refs) {
      const value = refs[key].current?.value;
      const errorMessage = validations[key](value);
      if (errorMessage) {
        validationErrors[key] = errorMessage;
        if (!firstErrorKey) firstErrorKey = key; // Captura la primera clave con error
      }
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setAlertMessage("Todos los campos son obligatorios");

      // Enfocar el primer campo con error
      if (firstErrorKey && refs[firstErrorKey].current) {
        refs[firstErrorKey].current.focus();
      }

      return;
    }

    setLoading(true);

    try {
      if (!register) {
        throw new Error("register function is not defined in useAuth");
      }

      const response = await register(refs.email.current.value, refs.password.current.value, 'defaultProfileUrl');

      if (response.success) {
        router.push('/signIn');
      } else {
        setAlertMessage(response.message || "An error occurred during registration.");
        setErrors({ general: response.message || "An error occurred during registration." });
      }
    } catch (error) {
      setAlertMessage(`Error: ${error.message}`);
      setErrors({ general: `Error: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  return {
    refs,
    errors,
    setErrors,
    loading,
    alertMessage,
    setAlertMessage,
    handleRegister,
  };
};

export default useSignUpLogic;
