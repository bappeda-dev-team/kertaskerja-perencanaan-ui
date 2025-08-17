'use client'

import { ButtonGreen, ButtonRed, ButtonSky } from "@/components/global/Button";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getToken, getUser } from "@/components/lib/Cookie";
import { TbPencil, TbTrash, TbPlus } from "react-icons/tb";
import { ModalPeriode } from "./ModalPeriode";

interface Periode {
    id: number;
    tahun_awal: string;
    tahun_akhir: string;
    tahun_list: string;
    jenis_periode: string;
}

const Table = () => {

    const [Periode, setPeriode] = useState<Periode[]>([]);
    
    const [isOpenNewPeriode, setIsOpenNewPeriode] = useState<boolean>(false);
    const [isOpenEditPeriode, setIsOpenEditPeriode] = useState<boolean>(false);
    const [IdPeriode, setIdPeriode] = useState<number>(0);

    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchPeriode = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/periode/findall`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data;
                if (data == null || data.length == 0) {
                    setDataNull(true);
                    setPeriode([]);
                } else {
                    setDataNull(false);
                    setPeriode(data);
                }
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchPeriode();
    }, [token, FetchTrigger]);

    const handleModalNewPeriode = () => {
        if (isOpenNewPeriode) {
            setIsOpenNewPeriode(false);
        } else {
            setIsOpenNewPeriode(true);
        }
    }
    const handleModalEditPeriode = (id: number) => {
        if (isOpenEditPeriode) {
            setIsOpenEditPeriode(false);
            setIdPeriode(0);
        } else {
            setIsOpenEditPeriode(true);
            setIdPeriode(id);
        }
    }

    const hapusPeriode = async (id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        // console.log(id);
        try {
            const response = await fetch(`${API_URL}/periode/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            })
            if (!response.ok) {
                alert("response !ok saat hapus data Periode")
            }
            AlertNotification("Berhasil", "Data Periode Berhasil Dihapus", "success", 1000);
            setFetchTrigger((prev) => !prev);
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
            console.error(err);
        }
    };

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 font-bold mx-5 py-5">Periksa koneksi internet atau database server</h1>
            </div>
        )
    }

    return (
        <>
            <div className="flex items-center justify-between border-b px-5 py-5">
                <h1 className="uppercase font-bold">Data Master Periode</h1>
                <ButtonSky onClick={handleModalNewPeriode}>
                    <TbPlus className="mr-1 " />
                    Tambah Periode
                </ButtonSky>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-gray-500 text-white">
                            <th className="border-r border-b py-3 text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Tahun Awal</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Tahun Akhir</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Jenis Periode</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ? (
                            <tr>
                                <td className="px-6 py-3" colSpan={30}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                        ) : (
                            Periode.map((item: Periode, index: number) => (
                                <tr key={item.id}>
                                    <td className="border-x border-b border-gray-500 py-4 text-center">{index + 1}</td>
                                    <td className="border-x border-b border-gray-500 px-6 py-4 text-center">{item.tahun_awal || "-"}</td>
                                    <td className="border-r border-b border-gray-500 px-6 py-4 text-center">{item.tahun_akhir || "-"}</td>
                                    <td className="border-r border-b border-gray-500 px-6 py-4 text-center">{item.jenis_periode || "-"}</td>
                                    <td className="border-r border-b border-gray-500 px-6 py-4 flex flex-col gap-1 justify-center">
                                        <ButtonGreen
                                            onClick={() => handleModalEditPeriode(item.id)}
                                        >
                                            <TbPencil className="mr-1" />
                                            Edit
                                        </ButtonGreen>
                                        <ButtonRed
                                            onClick={() => {
                                                AlertQuestion("Hapus?", `Hapus Periode yang dipilih? ${item.id}`, "question", "Hapus", "Batal").then((result) => {
                                                    if (result.isConfirmed) {
                                                        hapusPeriode(item.id);
                                                    }
                                                });
                                            }}
                                        >
                                            <TbTrash className="mr-1" />
                                            Hapus
                                        </ButtonRed>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {/* MODAL EDIT PERIODE */}
                <ModalPeriode
                    metode="baru"
                    isOpen={isOpenNewPeriode}
                    onClose={() => handleModalNewPeriode()}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
                {/* MODAL EDIT PERIODE */}
                <ModalPeriode
                    metode="lama"
                    id={IdPeriode}
                    isOpen={isOpenEditPeriode}
                    onClose={() => handleModalEditPeriode(0)}
                    onSuccess={() => setFetchTrigger((prev) => !prev)}
                />
            </div>
        </>
    )
}

export default Table;
