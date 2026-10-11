"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser, getUserProfile } from "@/features/auth/services/authGET";
import { login } from "@/features/auth/services/authPOST";
import {logout} from "@/features/auth/services/authLogoutPOST"
export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [profile, setProfile] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUser();
    }, []);

    async function loadUser() {
        const currentUser = await getCurrentUser();
        setUser(currentUser);

        const userProfile = await getUserProfile();
        setProfile(userProfile);

        setLoading(false);
       
        return;
    }

    async function signIn(username, senha) {
        await login(username, senha);

        const currentUser = await getCurrentUser();
        const userProfile = await getUserProfile();

        setProfile(userProfile);
        setUser(currentUser);
    }

    async function signOut() {
        await logout();
        setUser(null);
        setProfile(null);
    }

    return (
        <AuthContext.Provider value={{ user, profile, loading, signIn, signOut, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    };
    return context;
}

