"use client";

import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import Sidebar from "@/components/global/Sidebar";
import Header from "@/components/global/Header";
import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    display: 'swap', // Mengatur tampilan swap agar tidak ada flash saat font dimuat
});

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState<boolean>(true);
    const [isZoomed, setIsZoomed] = useState<boolean | null>(null);
    const { user } = useUser();

    const checkZoomLevel = () => {
        const zoomLevel = window.devicePixelRatio;
        if (zoomLevel >= 1.5) {
            setIsZoomed(true);
            setIsOpen(false);
        } else {
            setIsZoomed(false);
            setIsOpen(true);
        }
    };

    useEffect(() => {
        checkZoomLevel();
        window.addEventListener("resize", checkZoomLevel);
        return () => window.removeEventListener("resize", checkZoomLevel);
    }, []);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <>
            {user && <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} isZoomed={isZoomed} user={user} />}
            <div className={`w-full ${isOpen ? "pl-[16rem]" : ""}`}>
                {user && <Header user={user} />}
                <div className={`${font.className} px-4 py-2`}>{children}</div>
            </div>
        </>
    );
}
