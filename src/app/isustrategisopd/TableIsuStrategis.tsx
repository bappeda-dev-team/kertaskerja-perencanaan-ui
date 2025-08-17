'use client'

import React, { useEffect, useState } from "react";
import { ButtonSkyBorder, ButtonRedBorder, ButtonGreenBorder } from "@/components/global/Button";
import { TbCirclePlus, TbPencil, TbTrash } from "react-icons/tb";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { ModalIsu } from "./ModalIsu";
import { LoadingBeat } from "@/components/global/Loading";
import { useBrandingContext } from "@/context/BrandingContext";
import { IsuStrategis, DataDukung, TargetJumlahData, PermasalahanOpd } from "@/types";

interface table {
    id_periode: number;
    tahun_awal: string;
    tahun_akhir: string;
    jenis: string;
    tahun_list: string[];
}

const TableIsuStrategis: React.FC<table> = ({ id_periode, tahun_awal, tahun_akhir, jenis, tahun_list }) => {

    const { branding } = useBrandingContext();
    const [Isu, setIsu] = useState<IsuStrategis[]>([]);
    const [Modal, setModal] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<"baru" | "edit" | "">("");

    const [Loading, setLoading] = useState<boolean>(false);
    const [Error, setError] = useState<boolean>(false);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);

    const handleModal = (jenis: "baru" | "edit" | "") => {
        if (Modal) {
            setJenisModal('');
            setModal(false);
        } else {
            setJenisModal(jenis);
            setModal(true);
        }
    }

    useEffect(() => {
        const API_URL = branding?.api_permasalahan;
        const fetchIsuStrategis = async () => {
            try {
                setLoading(true);
                const response = await fetch(`${API_URL}/isu_strategis/${branding?.opd?.value}/${tahun_awal}/${tahun_akhir}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const result = await response.json();
                if (result.code === 200) {
                    setIsu(result.data);
                    setError(false);
                    // console.log(result.data);
                } else {
                    console.log(result.data);
                    setError(true);
                }
            } catch (err) {
                setError(true);
                console.log(err);
            } finally {
                setLoading(false);
            }
        }
        if (tahun_awal && tahun_akhir) {
            fetchIsuStrategis();
        }
    }, [branding, tahun_akhir, tahun_awal]);

    const hapusIsu = async(id: number) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_PERMASALAHAN;
        try{
            const response = await fetch(`${API_URL}/isu_strategis/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type' : 'application/json'
                }
            });
            const result = await response.json();
            if(result.code === 200 || result.code == 201){
                setIsu(Isu.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", `Berhasil menghapus data isu strategis`, "success");
            } else {
                AlertNotification("Gagal", `${result.data}`, "error");
                console.log(result.data);
            }
        } catch(err){
            console.error(err);
        }
    }

    if (Error) {
        return (
            <div className="text-red-500">
                Error data permasalahan, Periksa koneksi internet, jika error berlajut silakan hubungi tim developer
            </div>
        )
    } else if (Loading) {
        return (
            <div className="border rounded-lg m-2">
                <LoadingBeat />
            </div>
        )
    }

    return (
        <>
            <div className="flex my-3 ml-3">
                <ButtonGreenBorder
                    className="flex items-center gap-1"
                    onClick={() => handleModal("baru")}
                >
                    <TbCirclePlus />
                    Tambah Isu Strategis
                </ButtonGreenBorder>
            </div>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-emerald-500 text-white">
                            <th rowSpan={2} className="border-r border-b px-3 py-3 w-[50px]">No</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Bidang Urusan</th>
                            <th rowSpan={2} colSpan={2} className="border-r border-b px-6 py-3 min-w-[400px]">Isu Strategis</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Permasalahan</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Nama Data Dukung</th>
                            <th rowSpan={2} className="border-r border-b px-6 py-3 min-w-[250px]">Narasi Data Dukung</th>
                            {tahun_list.map((item: any) => (
                                <th key={item} colSpan={2} className="border-r border-b px-6 py-3">{item}</th>
                            ))}
                        </tr>
                        <tr className={`bg-emerald-600 text-white`}>
                            {tahun_list.map((item: any) => (
                                <React.Fragment key={item}>
                                    <th className="border-r border-b px-6 py-1 min-w-[50px]">Jumlah</th>
                                    <th className="border-r border-b px-6 py-1 min-w-[50px]">Satuan</th>
                                </React.Fragment>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {Isu.length === 0 ?
                            <tr>
                                <td colSpan={18} className="border-x border-b border-emerald-500 py-4 px-5">
                                    Data Isu Strategis Kosong
                                </td>
                            </tr>
                            :
                            Isu.map((i: IsuStrategis, index: number) => (
                                <React.Fragment key={index}>
                                    <tr>
                                        <td rowSpan={i.permasalahan_opd ? i.permasalahan_opd.length + 1 : 2} className="border-x border-b border-emerald-500 py-4 px-3 text-center">{index + 1}</td>
                                        <td rowSpan={i.permasalahan_opd ? i.permasalahan_opd.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4">{i.kode_bidang_urusan || "no code"} - {i.nama_bidang_urusan || "-"}</td>
                                        <td rowSpan={i.permasalahan_opd ? i.permasalahan_opd.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4">{i.isu_strategis || "-"}</td>
                                        <td rowSpan={i.permasalahan_opd ? i.permasalahan_opd.length + 1 : 2} className="border-r border-b border-emerald-500 px-6 py-4">
                                            <div className="flex flex-col jutify-center items-center gap-2">
                                                <ButtonSkyBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => handleModal("edit")}
                                                >
                                                    <TbPencil />
                                                    Edit
                                                </ButtonSkyBorder>
                                                <ButtonRedBorder
                                                    className="flex items-center gap-1 w-full"
                                                    onClick={() => {
                                                        AlertQuestion("Hapus?", "Data Isu Strategis akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                                            if (result.isConfirmed) {
                                                                hapusIsu(i.id);
                                                            }
                                                        });
                                                    }}
                                                >
                                                    <TbTrash />
                                                    Hapus
                                                </ButtonRedBorder>
                                            </div>
                                        </td>
                                    </tr>
                                    {!i.permasalahan_opd || i.permasalahan_opd.length === 0 ?
                                        <tr>
                                            <td colSpan={15} className="border-r border-b border-emerald-500 px-6 py-4 text-red-400 italic">Permasalahan belum di tambahkan</td>
                                        </tr>
                                        :
                                        i.permasalahan_opd.map((p: PermasalahanOpd, sub_index: number) => (
                                            <tr key={sub_index}>
                                                <td className="border-r border-b border-emerald-500 px-6 py-4">{p.masalah || "-"}</td>
                                                {p.data_dukung.map((dd: DataDukung, dd_index) => (
                                                    <React.Fragment key={dd_index}>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{dd.data_dukung || "-"}</td>
                                                        <td className="border-r border-b border-emerald-500 px-6 py-4">{dd.narasi_data_dukung || "-"}</td>
                                                        {dd.jumlah_data.length === 0 ? 
                                                            tahun_list.map((tl: any, tl_index: number) => (
                                                                <React.Fragment key={tl_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">-</td>
                                                                </React.Fragment>
                                                            ))
                                                        :
                                                            dd.jumlah_data.map((d: TargetJumlahData, d_index: number) => (
                                                                <React.Fragment key={d_index}>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{d.jumlah_data || "-"}</td>
                                                                    <td className="border-r border-b border-emerald-500 px-6 py-4 text-center">{d.satuan || "-"}</td>
                                                                </React.Fragment>
                                                            ))
                                                        }
                                                    </React.Fragment>
                                                ))}
                                            </tr>
                                        ))
                                    }
                                </React.Fragment>
                            ))
                        }
                    </tbody>
                </table>
            </div>
            <ModalIsu
                isOpen={Modal}
                onClose={() => handleModal("")}
                metode={JenisModal}
                onSuccess={() => setFetchTrigger((prev) => !prev)}
            />
        </>
    )
}

export default TableIsuStrategis;