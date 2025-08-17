'use client'

import { ButtonRedBorder, ButtonGreenBorder } from "@/components/global/Button";
import { TbPencil, TbTrash } from "react-icons/tb";
import React, { useEffect, useState } from "react";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";
import { getOpdTahun } from "@/components/lib/Cookie";
import { TahunNull } from "@/components/global/OpdTahunNull";
import { getToken } from "@/components/lib/Cookie";
import { ModalCSF } from "./ModalCSF";

interface tematik {
    csf: CSF[];
    id: number;
    parent: number;
    tema: string;
    keterangan: string;
    indikator: indikator[];
}
interface DataTerukur {
    id: number;
    data_terukur: string;
}

interface AlasanKondisi {
    id: number;
    alasan_kondisi_strategis: string;
    data_terukur: DataTerukur[];
}

interface CSF {
    id: number;
    pohon_id: number;
    pernyataan_kondisi_strategis: string;
    alasan_kondisi: AlasanKondisi[];
}
interface indikator {
    id_indikator: string;
    nama_indikator: string;
    targets: target[];
}
type target = {
    id_target: string;
    target: string;
    satuan: string;
}

interface AksiCSF {
    buttonDelete: boolean;
    onDelete: () => void;
    onEdit: () => void;
}
interface TableTematik {
    data: tematik;
    rowSpan?: number;
    onDelete: () => void;
}

export const Table = () => {

    const [Tematik, setTematik] = useState<tematik[]>([]);
    const [Loading, setLoading] = useState<boolean | null>(null);
    const [Error, setError] = useState<boolean | null>(null);
    const [DataNull, setDataNull] = useState<boolean | null>(null);
    const [Tahun, setTahun] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    const [ModalOpen, setModalOpen] = useState<boolean>(false);
    const [JenisModal, setJenisModal] = useState<string>("");
    const [DataToEdit, setDataToEdit] = useState<any>(null);
    const [FetchTrigger, setFetchTrigger] = useState<boolean>(false);
    const token = getToken();

    useEffect(() => {
        const data = getOpdTahun();
        if (data.tahun) {
            const tahun = {
                value: data.tahun.value,
                label: data.tahun.label,
            }
            setTahun(tahun);
        }
        if (data.opd) {
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    }, []);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchTematik = async () => {
            setLoading(true)
            try {
                const response = await fetch(`${API_URL}/pohon_kinerja_admin/findall/${Tahun?.value}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                const result = await response.json();
                const data = result.data.tematiks;
                if (data == null) {
                    setDataNull(true);
                    setTematik([]);
                } else if (data.code == 500) {
                    setError(true);
                    setTematik([]);
                } else {
                    setDataNull(false);
                    setTematik(data);
                }
                setTematik(data);
            } catch (err) {
                setError(true);
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        if (Tahun?.value != undefined) {
            fetchTematik();
        }
    }, [Tahun, token, FetchTrigger]);

    const hapusTematik = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        try {
            const response = await fetch(`${API_URL}/pohon_kinerja_admin/delete/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.error(result);
            } else {
                setTematik(Tematik.filter((data) => (data.id !== id)))
                AlertNotification("Berhasil", "Data Tematik Berhasil Dihapus", "success", 1000);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const hapusCsf = async (id: any) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL_CSF;
        try {
            const response = await fetch(`${API_URL}/csf/${id}`, {
                method: "DELETE",
                headers: {
                    // Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            const result = await response.json();
            if (!response.ok) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
                console.error(result);
            } else {
                AlertNotification("Berhasil", "Data CSF Berhasil dihapus", "success", 1000);
                setFetchTrigger((prev) => !prev);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet atau database server", "error", 2000);
        }
    };
    const handleModal = (jenis: string, data?: any) => {
        if (ModalOpen) {
            setModalOpen(false);
            setJenisModal("");
            setDataToEdit(null);
        } else {
            setModalOpen(true);
            setJenisModal(jenis);
            setDataToEdit(data);
        }
    }

    if (Loading) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <LoadingClip className="mx-5 py-5" />
            </div>
        );
    } else if (Error) {
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="text-red-500 mx-5 py-5">Reload Halaman, Periksa koneksi internet atau database server</h1>
            </div>
        )
    } else if (Tahun?.value == undefined) {
        return <TahunNull />
    }

    return (
        <>
            <div className="overflow-auto m-2 rounded-t-xl border">
                <table className="w-full">
                    <thead>
                        <tr className="bg-sky-700 text-white">
                            <th className="border-r border-b px-6 py-3 min-w-[50px] text-center">No</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Peryataan kondisi strategis (Isu Strategis)</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Alasan Sebagai Kondisi Strategis</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Data Terukur Pendukung Pernyataan</th>
                            <th className="border-r border-b px-6 py-3 min-w-[100px]">Aksi</th>
                            <th className="border-r border-b px-6 py-3 min-w-[300px]">Kondisi Terukur Yang Diharapkan (Tema)</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Indikator</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Target/Satuan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[200px]">Keterangan</th>
                            <th className="border-l border-b px-6 py-3 min-w-[100px]">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {DataNull ?
                            <tr>
                                <td className="px-6 py-3 uppercase" colSpan={13}>
                                    Data Kosong / Belum Ditambahkan
                                </td>
                            </tr>
                            :
                            Tematik.map((data, index) => {
                                return (
                                    <React.Fragment key={data.id}>
                                        {data.csf ?
                                            // KONDISI DATA CSF ADA
                                            data.csf.map((c: CSF, csf_index: number) => (
                                                <React.Fragment key={csf_index}>
                                                    <tr>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 2}
                                                            className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center"
                                                        >
                                                            {index + 1}
                                                        </td>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 2}
                                                            className="border-r border-b bg-blue-100 border-white px-6 py-4"
                                                        >
                                                            {c.pernyataan_kondisi_strategis || "dalam pengembangan"}
                                                        </td>
                                                        <td className="h-0"></td>
                                                        <td className="h-0"></td>
                                                        <td
                                                            rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 2}
                                                            className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center"
                                                        >
                                                            <AksiCsf
                                                                buttonDelete={true}
                                                                onDelete={() => hapusCsf(data.id)}
                                                                onEdit={() => {
                                                                    handleModal("baru", data);
                                                                }}
                                                            />
                                                        </td>
                                                        {/* <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 1}>tema</td>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 1}>keterangan</td>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 1}>indikator</td>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 1}>target</td>
                                                        <td rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 1}>aksi</td> */}
                                                        <TableTematik
                                                            data={data}
                                                            rowSpan={c.alasan_kondisi != null ? c.alasan_kondisi.length + 1 : 2}
                                                            onDelete={() => {
                                                                hapusTematik(data.id);
                                                            }}
                                                        />
                                                    </tr>
                                                    {c.alasan_kondisi === null &&
                                                        <tr>
                                                            <td className="border-r border-b bg-blue-100 border-white px-6 py-4">-</td>
                                                            <td className="border-r border-b bg-blue-100 border-white px-6 py-4">-</td>
                                                        </tr>
                                                    }
                                                    {c.alasan_kondisi != null &&
                                                        c.alasan_kondisi.map((a: AlasanKondisi, a_index: number) => (
                                                            <tr key={a_index}>
                                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                                                                    {a.alasan_kondisi_strategis || "-"}
                                                                </td>
                                                                {a.data_terukur && a.data_terukur.length > 0 ? (
                                                                    <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                                                                        {a.data_terukur.map((dt: DataTerukur, dt_index: number) => (
                                                                            <p key={dt_index} className={`py-2 ${a.data_terukur.length > 1 && dt_index < a.data_terukur.length - 1 ? "border-b border-white" : ""}`}>
                                                                                {dt.data_terukur || "-"}
                                                                            </p>
                                                                        ))}
                                                                    </td>
                                                                ) : (
                                                                    <td className="border-r border-b bg-blue-100 border-white px-6 py-4">
                                                                        <p>-</p>
                                                                    </td>
                                                                )}
                                                            </tr>
                                                        ))
                                                    }
                                                </React.Fragment>
                                            ))
                                            :
                                            // KONDISI DATA CSF KOSONG
                                            <tr>
                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center">{index + 1}</td>
                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center">-</td>
                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center">-</td>
                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center">-</td>
                                                <td className="border-r border-b bg-blue-100 border-white px-6 py-4 text-center">
                                                    <AksiCsf
                                                        buttonDelete={false}
                                                        onDelete={() => hapusCsf(data.id)}
                                                        onEdit={() => {
                                                            if (!data.csf) {
                                                                handleModal("baru", data);
                                                            } else {
                                                                handleModal("edit", data);
                                                            }
                                                        }}
                                                    />
                                                </td>
                                                <TableTematik
                                                    data={data}
                                                    onDelete={() => hapusTematik(data.id)}
                                                />
                                            </tr>
                                        }
                                    </React.Fragment>
                                )
                            }
                            )
                        }
                    </tbody>
                </table>
                {ModalOpen &&
                    <ModalCSF
                        isOpen={ModalOpen}
                        onClose={() => handleModal("")}
                        onSuccess={() => setFetchTrigger((prev) => !prev)}
                        jenis={JenisModal}
                        data={DataToEdit}
                    />
                }
            </div>
        </>
    )
}

export const AksiCsf: React.FC<AksiCSF> = ({ buttonDelete, onDelete, onEdit }) => {
    return (
        <div className="flex flex-col justify-center items-center gap-2">
            <ButtonGreenBorder
                className="flex items-center gap-1 w-full"
                onClick={onEdit}
            >
                <TbPencil />
                CSF
            </ButtonGreenBorder>
            {buttonDelete &&
                <ButtonRedBorder
                    className="flex items-center gap-1 w-full"
                    onClick={() => {
                        AlertQuestion("Hapus?", "Hapus CSF yang dipilih?", "question", "Hapus", "Batal").then((result) => {
                            if (result.isConfirmed) {
                                onDelete();
                            }
                        });
                    }}
                >
                    <TbTrash />
                    Hapus
                </ButtonRedBorder>
            }
        </div>
    )
}

export const TableTematik: React.FC<TableTematik> = ({ data, rowSpan, onDelete }) => {
    return (
        <React.Fragment>
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{data.tema || "-"}</td>
            {data.indikator ?
                <>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">
                        {data.indikator.map((item: indikator) => (
                            <p
                                key={item.id_indikator}
                                className={`${data.indikator.length > 1 && "border-b"} py-3`}
                            >
                                {item.nama_indikator}
                            </p>
                        ))}
                    </td>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">
                        {data.indikator.map((item: indikator) => (
                            item.targets.map((t: target) => (
                                <p
                                    key={t.id_target}
                                    className={`${data.indikator.length > 1 && "border-b"} py-3`}
                                >
                                    {t.target} / {t.satuan}
                                </p>
                            ))
                        ))}
                    </td>
                </>
                :
                <>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">-</td>
                    <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">-</td>
                </>
            }
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4 text-center">{data.keterangan ? data.keterangan : "-"}</td>
            <td rowSpan={rowSpan} className="border-r border-b px-6 py-4">
                <div className="flex flex-col jutify-center items-center gap-2">
                    <ButtonGreenBorder
                        className="flex items-center gap-1 w-full"
                        halaman_url={`/tematikpemda/${data.id}`}
                    >

                        <TbPencil />
                        Tema
                    </ButtonGreenBorder>
                    <ButtonRedBorder
                        className="flex items-center gap-1 w-full"
                        onClick={() => {
                            AlertQuestion("Hapus?", "Data Tematik dan CSF akan di hapus?", "question", "Hapus", "Batal").then((result) => {
                                if (result.isConfirmed) {
                                    onDelete
                                }
                            });
                        }}
                    >
                        <TbTrash />
                        Hapus
                    </ButtonRedBorder>
                </div>
            </td>
        </React.Fragment>
    )
}
