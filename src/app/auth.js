"use client";
import { createContext, useState, useEffect, useContext } from "react";
import { usePathname } from "next/navigation";
import { getCurrentUser, shouldSkipAuthCheck } from "@/app/services/Auth/GET";
import { login } from "@/app/services/Auth/POST";
import { logout } from "@/app/services/Auth/Logout/POST";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
    const pathname = usePathname();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (shouldSkipAuthCheck(pathname)) {
            setUser(null);
            setLoading(false);
            return;
        }

        loadUser();
    }, [pathname]);

    async function loadUser() {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setLoading(false);
        return;
    }

    async function signIn(username, senha) {
        await login(username, senha);

        const currentUser = await getCurrentUser();
        setUser(currentUser);
    }

    async function signOut() {
        await logout();
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, isAuthenticated: !!user }}>
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