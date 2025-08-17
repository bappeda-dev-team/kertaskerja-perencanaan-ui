'use client'

import { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { ButtonSky, ButtonRed } from '@/components/global/Button';
import { AlertNotification } from "@/components/global/Alert";
import { getToken } from "@/components/lib/Cookie";
import Select from 'react-select';
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { TbCirclePlus, TbCircleX } from "react-icons/tb";

interface OptionTypeString {
    value: string,
    label: string;
}

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    kode_opd: string;
    tahun: string;
    onSuccess: () => void;
}

interface FormValue {
    kode_subkegiatan: string;
    kode_opd: string;
    review: string;
    keterangan: string;
}

export const ModalSubKegiatanOpd: React.FC<ModalProps> = ({ isOpen, onClose, kode_opd, tahun, onSuccess }) => {

    const { control, handleSubmit, reset } = useForm<FormValue>();

    const [SubKegiatan, setSubKegiatan] = useState<OptionTypeString | null>(null);
    const [OptionSubKegiatan, setOptionSubKegiatan] = useState<OptionTypeString[]>([]);

    const [LoadingOption, setLoadingOption] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const token = getToken();

    const handleClose = () => {
        setSubKegiatan(null);
        onClose();
    };

    const fetchOptionSubKegiatan = async () => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        setLoadingOption(true);
        try {
            const response = await fetch(`${API_URL}/subkegiatanopd/bidangurusan/${kode_opd}`, {
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('error fetch option master sub kegiatan dengan response !ok');
            }
            const result = await response.json();
            const hasil = result.data;
            const data = hasil.map((item: any) => ({
                value: item.kode_subkegiatan,
                label: `${item.kode_subkegiatan} - ${item.nama_sub_kegiatan}`,
            }));
            setOptionSubKegiatan(data);
        } catch (err) {
            console.log('error saat fetch option Master Sub Kegaitan', err);
        } finally {
            setLoadingOption(false);
        }
    }

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            kode_subkegiatan: SubKegiatan?.value,
            kode_opd: kode_opd,
            tahun: tahun,
        };
        // console.log(formData);
        // console.log("endpoint", endpoint);
        try {
            setProses(true);
            const response = await fetch(`${API_URL}/subkegiatanopd/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if (result.code === 200 || result.code === 201) {
                AlertNotification("Berhasil", "Berhasil menambahkan Sub Kegiatan OPD", "success", 1000);
                onClose();
                onSuccess();
            } else {
                console.log(result);
                AlertNotification("Gagal", `${result.data}`, "error", 2000);
            }
        } catch (err) {
            AlertNotification("Gagal", "Cek koneksi internet / terdapat kesalahan pada server", "error", 2000);
            console.error(err);
        } finally {
            setProses(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-10">
            <div className="fixed inset-0 bg-black opacity-30" onClick={handleClose}></div>
            <div className="bg-white rounded-lg p-8 z-10 w-3/5 text-start">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="w-max-[500px] py-2 border-b font-bold text-center">
                        Tambah Sub Kegiatan OPD
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_subkegiatan"
                        >
                            Sub Kegiatan :
                        </label>
                        <Controller
                            name="kode_subkegiatan"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select
                                        {...field}
                                        placeholder="Pilih Sub Kegiatan dari Data Master"
                                        options={OptionSubKegiatan}
                                        isLoading={LoadingOption}
                                        isSearchable
                                        isClearable
                                        value={SubKegiatan}
                                        onMenuOpen={() => {
                                            fetchOptionSubKegiatan();
                                        }}
                                        onChange={(option) => {
                                            field.onChange(option);
                                            setSubKegiatan(option);
                                        }}
                                        styles={{
                                            control: (baseStyles) => ({
                                                ...baseStyles,
                                                borderRadius: '8px',
                                            }),
                                            menuPortal: (base) => ({ 
                                                ...base, zIndex: 9999 
                                            })
                                        }}
                                    />
                                </>
                            )}
                        />
                    </div>
                    <ButtonSky type="submit" className="w-full my-3" disabled={Proses}>
                        {Proses ?
                            <span className="flex items-center gap-1">
                                <LoadingButtonClip />
                                Menambahkan
                            </span>
                            :
                            <span className="flex items-center gap-1">
                                <TbCirclePlus />
                                Simpan
                            </span>
                        }
                    </ButtonSky>
                    <ButtonRed type="button" className="w-full my-3 flex items-center gap-1" onClick={handleClose} disabled={Proses}>
                        <TbCircleX />
                        Batal
                    </ButtonRed>
                </form>
            </div>
        </div>
    );
};
