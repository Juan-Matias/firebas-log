import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createContext, useEffect, useState, useContext } from "react";
import { auth, db } from "../conection/firebaseConfig";
import { doc, getDoc, setDoc } from 'firebase/firestore';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(undefined); // Inicialmente undefined

    useEffect(() => {
        const unSub = onAuthStateChanged(auth, async (user) => {
            if (user) {
                try {
                    const userData = await updateUserData(user.uid);
                    setUser({ ...user, ...userData });
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error('Error al cargar los datos del usuario: ', error.message);
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
        });
        return unSub;
    }, []);

    const updateUserData = async (userId) => {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            return {
                username: data.username,
                profileUrl: data.profileUrl,
                userId: data.userId
            };
        } else {
            throw new Error('No user data found');
        }
    };

    const login = async (email, password) => {
        try {
            const response = await signInWithEmailAndPassword(auth, email, password);
            const userData = await updateUserData(response.user.uid);
            setUser({ ...response.user, ...userData });
            setIsAuthenticated(true);
            return { success: true };
        } catch (error) {
            console.error('Error en el inicio de sesión: ', error.message);
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await signOut(auth);
            setIsAuthenticated(false);
            setUser(null);
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión: ', error.message);
            return { success: false, message: error.message };
        }
    };

    const register = async (email, password, profileUrl) => {
        try {
            const response = await createUserWithEmailAndPassword(auth, email, password);
            const userDocRef = doc(db, "users", response.user.uid);

            await setDoc(userDocRef, {
                email: email,
                profileUrl: profileUrl,
                userId: response.user.uid,
                createdAt: new Date().toISOString(),
            });

            const userData = await updateUserData(response.user.uid);
            setUser({ ...response.user, ...userData });
            setIsAuthenticated(true);

            return { success: true, data: response.user };
        } catch (error) {
            console.error('Error en el registro: ', error.message);
            let msg = error.message;
            if (msg.includes('(auth/invalid-email)')) msg = 'Invalid email';
            else if (msg.includes('(auth/weak-password)')) msg = 'Weak password';
            return { success: false, message: msg };
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
