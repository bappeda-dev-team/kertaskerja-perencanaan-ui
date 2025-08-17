"use client"

import { ButtonSky } from "@/components/global/Button";
import LoginButton from "@/components/global/LoginButton";
import { useUser } from "@/context/UserContext";
import Link from "next/link";
import { TbBook2, TbDownload } from "react-icons/tb";

const Dashboard = () => {
    const { user, loading, logoutClient } = useUser();

    if (loading) return <p>Loading...</p>;
    if (!user) return (
        <div className="flex flex-col items-center justify-center h-screen">
            <p className="mb-4 text-lg font-medium">
                harap login terlebih dahulu
            </p>
            <LoginButton />
        </div>
    )

    return (
        <div>
            <div className="flex flex-col gap-2">
                <h1 className="p-5 rounded-xl border border-emerald-500">
                    Selamat Datang, {user?.firstName ?? 'di halaman dashboard'}
                </h1>
                <div className="flex items-center justify-between gap-2 p-5 rounded-xl border border-sky-500">
                    <h1 className="flex items-center gap-2">
                        <TbBook2 className="font-bold text-4xl rounded-full p-1 border border-black" />
                        Download Panduan Website (Manual User)
                    </h1>
                    <Link
                        href="https://drive.google.com/drive/folders/1xFqVRchn8eCRtMLhWvqSb78qDxTXB9Y1?usp=sharing"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <ButtonSky className="flex items-center gap-2">
                            <TbDownload />
                            Download
                        </ButtonSky>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;
