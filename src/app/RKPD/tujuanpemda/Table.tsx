'use client'

import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

interface PemdaStrategicGoal {
    id: number;
    strategic_pemda: string;
    tujuan_pemda: string;
    indikator: string;
    rumus_perhitungan: string;
    sumber_data: string;
    target: {
        target: string;
        satuan: string;
    };
}

const data = [
    {
        "id": 1,
        "tema": "MENINGKATNYA PROFESIONALITAS ASN",
        "tujuan_pemda": "Terwujudnya profesionalitas ASN",
        "visi": "Meningkatkan kesejahteraan lingkungan pemerintahan",
        "indikator": "Indeks Profesional ASN",
        "rumus_perhitungan": "IP ASN didasarkan pada empat dimensi, yaitu kompetensi, kualifikasi, kinerja, dan kedisiplinan",
        "sumber_data": "Sistem Aplikasi Pelayanan Kepegawaian (SAPK) BKN, Data Pendaftaran Ulang PNS, Data yang terhimpun pada unit pengelola kepegawaian, Data yang dimiliki ASN yang bersangkutan",
        "target": {
            "target": "70",
            "satuan": "%"
        }
    }
]

const Table = () => {

    const { branding } = useBrandingContext();
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);

    const [Loading, setLoading] = useState<boolean | null>(null);
    const token = getToken();


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
    } else if (branding?.tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="text-xm bg-emerald-500 text-white">
                            <td rowSpan={2} className="border-r border-b px-6 py-3 max-w-[100px] text-center">No</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Strategic Pemda</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Sasaran Pemda</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[400px] text-center">Visi</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[200px]">Indikator</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Rumus Perhitungan</td>
                            <td rowSpan={2} className="border-r border-b px-6 py-3 min-w-[300px]">Sumber Data</td>
                            <th colSpan={2} className="border-l border-b px-6 py-3 min-w-[100px]">{branding?.tahun?.value}</th>
                        </tr>
                        <tr className="bg-emerald-500 text-white">
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Target</th>
                            <th className="border-l border-b px-6 py-3 min-w-[50px]">Satuan</th>
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
                            data.map((item, index) => (
                                <tr key={index}>
                                    <td className="border-x border-b border-emerald-500 py-4 px-3 text-center">
                                        {index + 1}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.tema || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.tujuan_pemda || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.visi || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        <div className="flex gap-2 items-center">
                                            <p>{item.indikator || "-"}</p>
                                        </div>
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.rumus_perhitungan || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.sumber_data || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.target.target || "-"}
                                    </td>
                                    <td className="border-r border-b border-emerald-500 px-6 py-4">
                                        {item.target.satuan || "-"}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default Table;
