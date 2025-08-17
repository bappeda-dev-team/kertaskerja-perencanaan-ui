'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { ButtonGreen, ButtonRedBorder, ButtonSkyBorder, ButtonRed } from "@/components/global/Button";
import { LoadingClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { getToken } from "@/components/lib/Cookie";

interface FormValue {
    id: string;
    nama_lembaga: string;
    kode_lembaga: string;
    id_lembaga: number;
}

export const FormMasterLembaga = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaLembaga, setNamaLembaga] = useState<string>('');
    const [KodeLembaga, setKodeLembaga] = useState<string>('');
    const router = useRouter();
    const token = getToken();

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const formData = {
            //key : value
            nama_lembaga : data.nama_lembaga,
            kode_lembaga : data.kode_lembaga,
        };
        // console.log(formData);
        try{
            const response = await fetch(`${API_URL}/lembaga/create`, {
                method: "POST",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil menambahkan data master lembaga", "success", 1000);
                router.push("/DataMaster/masterlembaga");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
      };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah Lembaga :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nama_lembaga"
                    >
                        Nama Lembaga :
                    </label>
                    <Controller
                        name="nama_lembaga"
                        control={control}
                        rules={{ required: "Nama Lembaga harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="nama_lembaga"
                                    type="text"
                                    placeholder="masukkan Nama Lembaga"
                                    value={field.value || NamaLembaga}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setNamaLembaga(e.target.value);
                                    }}
                                />
                                {errors.nama_lembaga ?
                                    <h1 className="text-red-500">
                                    {errors.nama_lembaga.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Nama Lembaga Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="kode_lembaga"
                    >
                        Kode Lembaga :
                    </label>
                    <Controller
                        name="kode_lembaga"
                        control={control}
                        rules={{ required: "Kode Lembaga harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="kode_lembaga"
                                    type="text"
                                    placeholder="masukkan kode lembaga"
                                    value={field.value || KodeLembaga}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setKodeLembaga(e.target.value);
                                    }}
                                />
                                {errors.kode_lembaga ?
                                    <h1 className="text-red-500">
                                    {errors.kode_lembaga.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*kode lembaga Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                
                <ButtonGreen
                    type="submit"
                    className="my-4"
                >
                    Simpan
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/DataMaster/masterlembaga">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditMasterLembaga = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [NamaLembaga, setNamaLembaga] = useState<string>('');
    const [KodeLembaga, setKodeLembaga] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const {id} = useParams();
    const router = useRouter();
    const token = getToken();

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchLembagaId = async() => {
            setLoading(true);
            try{
                const response = await fetch(`${API_URL}/lembaga/detail/${id}`, {
                    headers: {
                        Authorization: `${token}`,
                        'Content-Type': 'application/json',
                      },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                if(result.code == 404){
                    setIdNull(true);
                } else {
                    const data = result.data;
                    if(data.nama_lembaga){
                        setNamaLembaga(data.nama_lembaga);
                        reset((prev) => ({ ...prev, nama_lembaga: data.nama_lembaga }))
                    }
                    if(data.kode_lembaga){
                        setKodeLembaga(data.kode_lembaga);
                        reset((prev) => ({ ...prev, kode_lembaga: data.kode_lembaga }))
                    }
                }
            } catch(err) {
                setError('gagal mendapatkan data, periksa koneksi internet atau database server')
            } finally {
                setLoading(false);
            }
        }
        fetchLembagaId();
    },[id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const formData = {
          //key : value
          nama_lembaga : data.nama_lembaga,
          kode_lembaga : data.kode_lembaga,
      };
    //   console.log(formData);
        try{
            const response = await fetch(`${API_URL}/lembaga/update/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `${token}`,
                    'Content-Type': 'application/json',
                  },
                body: JSON.stringify(formData),
            });
            if(response.ok){
                AlertNotification("Berhasil", "Berhasil edit data master lembaga", "success", 1000);
                router.push("/DataMaster/masterlembaga");
            } else {
                AlertNotification("Gagal", "terdapat kesalahan pada backend / database server", "error", 2000);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        }
    };

    if(loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    } else {
        return(
        <>
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit Lembaga :</h1>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="flex flex-col mx-5 py-5"
                >
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="nama_lembaga"
                        >
                            Nama Lembaga :
                        </label>
                        <Controller
                            name="nama_lembaga"
                            control={control}
                            rules={{ required: "Nama Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="nama_lembaga"
                                        type="text"
                                        placeholder="masukkan Nama Lembaga"
                                        value={field.value || NamaLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setNamaLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.nama_lembaga ?
                                        <h1 className="text-red-500">
                                        {errors.nama_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*Nama Lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <div className="flex flex-col py-3">
                        <label
                            className="uppercase text-xs font-bold text-gray-700 my-2"
                            htmlFor="kode_lembaga"
                        >
                            Kode Lembaga :
                        </label>
                        <Controller
                            name="kode_lembaga"
                            control={control}
                            rules={{ required: "Kode Lembaga harus terisi" }}
                            render={({ field }) => (
                                <>
                                    <input
                                        {...field}
                                        className="border px-4 py-2 rounded-lg"
                                        id="kode_lembaga"
                                        type="text"
                                        placeholder="masukkan kode lembaga"
                                        value={field.value || KodeLembaga}
                                        onChange={(e) => {
                                            field.onChange(e);
                                            setKodeLembaga(e.target.value);
                                        }}
                                    />
                                    {errors.kode_lembaga ?
                                        <h1 className="text-red-500">
                                        {errors.kode_lembaga.message}
                                        </h1>
                                        :
                                        <h1 className="text-slate-300 text-xs">*kode lembaga Harus Terisi</h1>
                                    }
                                </>
                            )}
                        />
                    </div>
                    <ButtonGreen
                        type="submit"
                        className="my-4"
                    >
                        Simpan
                    </ButtonGreen>
                    <ButtonRed type="button" halaman_url="/DataMaster/masterlembaga">
                        Kembali
                    </ButtonRed>
                </form>
            </div>
        </>
        )
    }
}