"use client";
import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { getSessionExpiry } from "@/utils/session";
import { User } from "@/types"

type UserContextType = {
    user: User | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    logoutClient: () => void;
    authUrl: string;
};

const UserContext = createContext<UserContextType>({
    user: null,
    loading: true,
    refreshUser: async () => {},
    logoutClient: () => {},
    authUrl: ""
});

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const AUTH_URL = process.env.NEXT_PUBLIC_AUTH_URL;
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const timerRef = useRef<number | null>(null);

    const redirectUri = `${API_URL}/perencanaan`
    const authUrl = AUTH_URL ? `${AUTH_URL}?redirect_uri=${redirectUri}` : '#'

    // schedule auto logout saat exp lewat
    const scheduleLogout = () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
        const exp = getSessionExpiry();
        if (!exp) return;

        const ms = exp - Date.now();
        if (ms <= 0) {
            setUser(null);
            return;
        }

        timerRef.current = window.setTimeout(() => {
            setUser(null);
        }, ms);
    };

    // fetch profil user sekali
    const refreshUser = async () => {
        try {
            setLoading(true);
            const res = await fetch("/user", { credentials: "include" });
            if (!res.ok) throw new Error("Unauthorized");
            const data: User = await res.json();
            setUser(data);
            setLoading(false);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
            scheduleLogout();
        }
    };

    const logoutClient = () => {
        setUser(null);
        if (timerRef.current) window.clearTimeout(timerRef.current);
    };

    // init saat mount
    useEffect(() => {
        refreshUser();
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fetch wrapper: reset state kalau 401
    useEffect(() => {
        const origFetch = window.fetch;
        window.fetch = async (input: RequestInfo | URL, init?: RequestInit) => {
            const res = await origFetch(input, { credentials: "include", ...init });
            if (res.status === 401) {
                setUser(null);
            }
            return res;
        };
        return () => {
            window.fetch = origFetch;
        };
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, logoutClient, authUrl }}>
            {children}
        </UserContext.Provider>
    );
};
