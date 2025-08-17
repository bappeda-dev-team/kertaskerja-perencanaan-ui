'use client'

import { ButtonGreen, ButtonRed, ButtonSkyBorder, ButtonGreenBorder, ButtonBlackBorder } from "@/components/global/Button";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { LoadingClip } from "@/components/global/Loading";
import { useState, useEffect } from "react";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";

interface User {
    id: string;
    nip: string;
    email: string;
    nama_pegawai: string;
    is_active: boolean;
    role: roles[];
}
interface roles {
    id: string;
    role: string;
}

const Table = () => {

    const [user, setuser] = useState<any>(null);
    const [User, setUser] = useState<User[]>([]);
    const [LevelUser, setLevelUser] = useState<string>('');
    const [error, setError] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);
    const token = getToken();

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setuser(fetchUser.user);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[])

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUrusan = async(url: string) => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/${url}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if(data == null){
                    setDataNull(true);
                    setUser([]);
                } else if(data.code == 500){
                    setError(true);
                    setUser([]);
                } else if(result.code === 401){
                    setError(true);
                } else {
                    setError(false);
                    setDataNull(false);
                    setUser(data);
                }
                setUser(data);
            } catch(err){
                setError(true);
                console.error(err)
            } finally{
                setLoading(false);
            }
        }
        if(user?.roles != undefined || null){
            if(user?.roles == 'super_admin'){
                fetchUrusan(`user/findall?kode_opd=${SelectedOpd?.value}`);
            } else {
                fetchUrusan(`user/findall?kode_opd=${user?.kode_opd}`);
            }
        }
    }, [token, user, SelectedOpd]);

    const hapusUrusan = async(id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try{
            const response = await fetch(`${API_URL}/user/delete/${id}`, {
                method: "DELETE",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
            })
            if(!response.ok){
                alert("cant fetch data")
            }
            setUser(User.filter((data) => (data.id !== id)))
            AlertNotification("Berhasil", "Data User Berhasil Dihapus", "success", 1000);
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };

    if(Loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if(user?.roles == 'super_admin'){
        if(SelectedOpd == undefined || null){
            return (
                <div className="border p-5 rounded-xl shadow-xl">
                    <h1 className="mx-5 py-5">Super Admin Wajib Pilih OPD di header terlebih dahulu</h1>
                </div>
            )
        }
    }

    return(
        <>
            {/* <div className="flex flex-wrap gap-2 items-center justify-center px-3 py-2">
                <div className="flex flex-wrap justify-center items-center gap-2">
                    {LevelUser == '' ? 
                        <button className="px-3 py-1 text-center bg-black rounded-lg text-white">Semua Level</button>
                    :
                        <ButtonBlackBorder onClick={() => {setLevelUser('')}}>Semua Level</ButtonBlackBorder>
                    }
                    {LevelUser == 'super_admin' ? 
                        <button className="px-3 py-1 text-center bg-sky-500 rounded-lg text-white">Super Admin</button>
                    :
                        <ButtonSkyBorder onClick={() => {setLevelUser('super_admin')}}>Super Admin</ButtonSkyBorder>
                    }
                    {LevelUser == 'admin_opd' ? 
                        <button className="px-3 py-1 text-center bg-sky-500 rounded-lg text-white">Admin OPD</button>
                    :
                        <ButtonSkyBorder className={`${LevelUser == ''}`} onClick={() => {setLevelUser('admin_opd')}}>Admin OPD</ButtonSkyBorder>
                    }
                    {LevelUser == 'level_1' ? 
                        <button className="px-3 py-1 text-center bg-green-500 rounded-lg text-white">Level 1</button>
                    :
                        <ButtonGreenBorder onClick={() => {setLevelUser('level_1')}}>Level 1</ButtonGreenBorder>
                    }
                    {LevelUser == 'level_2' ? 
                        <button className="px-3 py-1 text-center bg-green-500 rounded-lg text-white">Level 2</button>
                    :
                        <ButtonGreenBorder onClick={() => {setLevelUser('level_2')}}>Level 2</ButtonGreenBorder>
                    }
                    {LevelUser == 'level_3' ? 
                        <button className="px-3 py-1 text-center bg-green-500 rounded-lg text-white">Level 3</button>
                    :
                        <ButtonGreenBorder onClick={() => {setLevelUser('level_3')}}>Level 3</ButtonGreenBorder>
                    }
                    {LevelUser == 'level_4' ? 
                        <button className="px-3 py-1 text-center bg-green-500 rounded-lg text-white">Level 4</button>
                    :
                        <ButtonGreenBorder onClick={() => {setLevelUser('level_4')}}>Level 4</ButtonGreenBorder>
                    }
                </div>
            </div> */}
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px]">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Nama</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">NIP</th>
                            <th className="border-r border-b px-6 py-3 min-w-[200px]">Email</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Status</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Roles</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                    {DataNull ? 
                        <tr>
                            <td className="px-6 py-3 uppercase" colSpan={13}>
                                Tidak ada User / Belum Ditambahkan
                            </td>
                        </tr>
                    :
                        User.map((data, index) => (
                        <tr key={data.id}>
                            <td className="border-r border-b px-6 py-4 text-center">{index + 1}</td>
                            <td className="border-r border-b px-6 py-4">{data.nama_pegawai? data.nama_pegawai : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.nip? data.nip : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.email ? data.email : "-"}</td>
                            <td className="border-r border-b px-6 py-4 text-center">{data.is_active === true ? 'Aktif' : 'tidak aktif'}</td>
                            {data.role ? 
                                <td className="border-r border-b px-6 py-4 text-center">
                                    {data.role ? data.role.map((r: any) => r.role).join(", ") : "-"}
                                </td>
                            :
                                <td className="border-r border-b px-6 py-4 text-center">-</td>
                            }
                            <td className="border-r border-b px-6 py-4">
                                <div className="flex flex-col jutify-center items-center gap-2">
                                    <ButtonGreen className="w-full" halaman_url={`/useropd/${data.id}`}>Edit</ButtonGreen>
                                    <ButtonRed 
                                        className="w-full"
                                        onClick={() => {
                                            AlertQuestion("Hapus?", "Hapus urusan yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                                                if(result.isConfirmed){
                                                    hapusUrusan(data.id);
                                                }
                                            });
                                        }}
                                    >
                                        Hapus
                                    </ButtonRed>
                                </div>
                            </td>
                        </tr>
                        ))
                    }
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;