import { createContext, useEffect, useState, useContext } from "react";

export const AuthContext = createContext();

// 7:21

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined);

    useEffect(() => {
        // Aquí deberías agregar la lógica para manejar el estado de autenticación, por ejemplo:
        // onAuthStateChanged(auth, (user) => {
        //     if (user) {
        //         setUser(user);
        //         setIsAuthenticated(true);
        //     } else {
        //         setUser(null);
        //         setIsAuthenticated(false);
        //     }
        // });
    }, []);

    const login = async (email, password) => {
        try {
            // Lógica para iniciar sesión
        } catch (error) {
            // Manejo de errores
        }
    };

    const logout = async () => {
        try {
            // Lógica para cerrar sesión
        } catch (error) {
            // Manejo de errores
        }
    };

    const register = async (email, password, profileUrl) => {
        try {
            // Lógica para registrar un nuevo usuario
        } catch (error) {
            // Manejo de errores
        }
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const value = useContext(AuthContext);

    if (!value) {
        throw new Error("useAuth must be wrapped inside AuthContextProvider");
    }

    return value;
};
