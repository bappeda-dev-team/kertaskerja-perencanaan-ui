'use client'

import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm, useFieldArray } from "react-hook-form";
import { ButtonSky, ButtonRed, ButtonSkyBorder, ButtonRedBorder } from '@/components/global/Button';
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingButtonClip, LoadingClip } from "@/components/global/Loading";
import { AlertNotification, AlertQuestion } from "@/components/global/Alert";

interface OptionTypeString {
    value: string;
    label: string;
}

interface FormValue {
    kode: string;
    kode_opd: string;
    indikator: string;
    tahun: string;
    pagu_anggaran?: number;
    target: string;
    satuan: string;
}

interface modal {
    isOpen: boolean;
    onClose: () => void;
    metode: 'lama' | 'baru';
    pagu: 'pagu' | 'non-pagu'
    nama: string;
    jenis: string;
    id?: string;
    kode: string;
    tahun?: string;
    kode_opd?: string;
    onSuccess: () => void;
}

export const ModalMatrix: React.FC<modal> = ({ isOpen, onClose, id, kode, kode_opd, pagu, nama, jenis, metode, tahun, onSuccess }) => {

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<FormValue>();

    const token = getToken();

    const [Indikator, setIndikator] = useState<string>('');
    const [Target, setTarget] = useState<string>('');
    const [Satuan, setSatuan] = useState<string>('');
    const [Pagu, setPagu] = useState<number | null>(null);

    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [IdNull, setIdNull] = useState<boolean>(false);

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchDetail = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${API_URL}/matrix_renstra/indikator/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                    }
                });
                const result = await response.json();
                const data = result.data;
                // console.log(data);
                if (result.code === 200) {
                    setIdNull(false);
                    if (data.indikator) {
                        setIndikator(data.indikator);
                    }
                    if (data.pagu_anggaran) {
                        setPagu(data.pagu_anggaran);
                    }
                    if (data.target)
                        setTarget(data.target[0].target)
                    setSatuan(data.target[0].satuan);
                } else {
                    setIdNull(true);
                }
            } catch (err) {
                console.error(err);
                alert(err);
            } finally {
                setIsLoading(false);
            }
        }
        if (isOpen && metode === 'lama') {
            fetchDetail();
        }
    }, [isOpen, id, metode, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formDataPagu = {
            //key : value
            kode: kode,
            kode_opd: kode_opd,
            indikator: Indikator,
            tahun: tahun,
            target: Target,
            satuan: Satuan,
            pagu_anggaran: Pagu,
        };
        const formDataNonPagu = {
            //key : value
            kode: kode,
            kode_opd: kode_opd,
            indikator: Indikator,
            tahun: tahun,
            target: Target,
            satuan: Satuan,
        };
        const getBody = () => {
            if (pagu === "pagu") return formDataPagu;
            if (pagu === "non-pagu") return formDataNonPagu;
            return {}; // Default jika metode tidak sesuai
        };
        // pagu === 'pagu' && console.log("baru :", formDataPagu);
        // pagu === 'non-pagu' && console.log("lama :", formDataNonPagu);
        try {
            let url = "";
            if (metode === "lama") {
                url = `matrix_renstra/indikator/update_indikator/${id}`;
            } else if (metode === "baru") {
                url = `matrix_renstra/indikator/create_indikator`;
            } else {
                url = '';
            }
            setProses(true);
            const response = await fetch(`${API_URL}/${url}`, {
                method: metode === 'lama' ? "PUT" : "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(getBody()),
            });
            const result = await response.json();
            if (result.code === 201 || result.code === 200) {
                AlertNotification("Berhasil", `Berhasil ${metode === 'baru' ? "Menambahkan" : "Mengubah"} Indikator`, "success", 1000);
                onClose();
                onSuccess();
                reset();
            } else if (result.code === 500) {
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server dengan response !ok", "error", 2000);
                console.error(result);
            }
        } catch (err) {
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    const formatNumberWithDots = (value: number | string | null) => {
        if (value === null || value === undefined || value === '') return '';
        // Hapus karakter non-digit yang mungkin sudah ada (termasuk titik atau spasi)
        const numberString = String(value).replace(/\D/g, '');
        if (numberString === '') return '';
        // Format dengan TITIK sebagai pemisah ribuan
        return numberString.replace(/\B(?=(\d{3})+(?!\d))/g, '.'); // Ganti ' ' menjadi '.'
    };
    const unformatNumber = (value: number | string) => {
        if (value === null || value === undefined || value === '') return null;
        // Hapus spasi, titik, dan karakter non-digit lainnya
        const numberString = String(value).replace(/\D/g, '');
        // Kembalikan null jika string kosong, atau angka jika valid
        return numberString === '' ? null : Number(numberString);
    };

    const handleClose = () => {
        onClose();
        setIndikator('');
        setTarget('');
        setSatuan('');
        setPagu(null);
    }

    if (!isOpen) {
        return null;
    } else {

        return (
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
                <div className={`bg-white rounded-lg p-8 z-10 w-5/6 max-h-[80%] overflow-auto`}>
                    {IsLoading ?
                        <LoadingClip />
                        :
                        <>
                            <div className="w-max-[500px] py-2 border-b">
                                <h1 className="text-xl uppercase text-center">{metode === 'baru' ? "Tambah" : "Edit"} Indikator tahun {tahun}</h1>
                            </div>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                className="flex flex-col mx-5 py-5"
                            >
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                    >
                                        {jenis}:
                                    </label>
                                    <div className="border px-4 py-2 rounded-lg">{nama}</div>
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="indikator"
                                    >
                                        Indikator:
                                    </label>
                                    <Controller
                                        name="indikator"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="indikator"
                                                placeholder="masukkan Indikator"
                                                value={Indikator}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setIndikator(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="target"
                                    >
                                        Target:
                                    </label>
                                    <Controller
                                        name="target"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="target"
                                                placeholder="masukkan Target"
                                                value={Target}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setTarget(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col py-3">
                                    <label
                                        className="uppercase text-xs font-bold text-gray-700 my-2"
                                        htmlFor="satuan"
                                    >
                                        Satuan:
                                    </label>
                                    <Controller
                                        name="satuan"
                                        control={control}
                                        render={({ field }) => (
                                            <textarea
                                                {...field}
                                                className="border px-4 py-2 rounded-lg"
                                                id="satuan"
                                                placeholder="masukkan Satuan"
                                                value={Satuan}
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setSatuan(e.target.value);
                                                }}
                                            />
                                        )}
                                    />
                                </div>
                                {pagu === 'pagu' &&
                                    <div className="flex flex-col py-3">
                                        <label
                                            className="uppercase text-xs font-bold text-gray-700 my-2"
                                            htmlFor="pagu_anggaran"
                                        >
                                            Pagu Anggaran (Rp.)
                                        </label>
                                        <Controller
                                            name="pagu_anggaran"
                                            control={control}
                                            render={({ field }) => {
                                                const handleInputChange = (e: any) => {
                                                    const inputValue = e.target.value;
                                                    const numericValue = unformatNumber(inputValue);
                                                    field.onChange(numericValue);
                                                    setPagu(unformatNumber(inputValue));
                                                };
                                                const displayValue = formatNumberWithDots(Pagu);
                                                return (
                                                    <input
                                                        {...field}
                                                        className="border px-4 py-2 rounded-lg"
                                                        id="pagu_anggaran"
                                                        placeholder="masukkan Pagu Anggaran"
                                                        value={displayValue === null ? "" : displayValue}
                                                        type="text"
                                                        inputMode="numeric"
                                                        onChange={handleInputChange}
                                                    />
                                                )
                                            }}
                                        />
                                    </div>
                                }
                                <ButtonSky className="w-full mt-3" type="submit" disabled={Proses}>
                                    {Proses ?
                                        <span className="flex">
                                            <LoadingButtonClip />
                                            Menyimpan...
                                        </span>
                                        :
                                        "Simpan"
                                    }
                                </ButtonSky>
                                <ButtonRed type="button" className="w-full my-2" onClick={handleClose}>
                                    Batal
                                </ButtonRed>
                            </form>
                        </>
                    }
                </div>
            </div>
        )
    }
}