'use client'

import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Select from 'react-select';
import { ButtonGreen, ButtonRed } from "@/components/global/Button";
import { LoadingClip, LoadingButtonClip } from "@/components/global/Loading";
import { AlertNotification } from "@/components/global/Alert";
import { useRouter, useParams } from "next/navigation";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { getToken, getUser, getOpdTahun } from "@/components/lib/Cookie";

interface OptionType {
    value: number;
    label: string;
}
interface OptionTypeString {
    value: string;
    label: string;
}
interface OptionTypeBoolean {
    value: boolean;
    label: string;
}
interface FormValue {
    nip: OptionTypeString;
    email: string;
    password: string;
    is_active: OptionTypeBoolean;
    role: OptionType[];
}

export const FormUserOpd = () => {

    const {
      control,
      handleSubmit,
      formState: { errors },
    } = useForm<FormValue>();
    const [Nip, setNip] = useState<OptionTypeString | null>(null);
    const [Email, setEmail] = useState<string>('');
    const [Password, setPassword] = useState<string>('');
    const [Aktif, setAktif] = useState<OptionTypeBoolean | null>(null);
    const [Roles, setRoles] = useState<OptionType[]>([]);
    const [PegawaiOption, setPegawaiOption] = useState<OptionTypeString[]>([]);
    const [RolesOption, setRolesOption] = useState<OptionType[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();
    const token = getToken();
    const [showPassword, setShowPassword] = useState(false);
    const [User, setUser] = useState<any>(null);
    const [SelectedOpd, setSelectedOpd] = useState<any>(null);

    useEffect(() => {
        const fetchUser = getUser();
        const data = getOpdTahun();
        if(fetchUser){
            setUser(fetchUser.user);
        }
        if(data.opd){
            const opd = {
                value: data.opd.value,
                label: data.opd.label,
            }
            setSelectedOpd(opd);
        }
    },[]);

    const fetchRoles = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/role/findall`,{
          method: 'GET',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const role = data.data.map((item: any) => ({
          value : item.id,
          label : item.role,
        }));
        setRolesOption(role);
      } catch (err){
        console.log('gagal mendapatkan data roles');
      } finally {
        setIsLoading(false);
      }
    };
    const fetchPegawai = async(kode_opd: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/pegawai/findall?kode_opd=${kode_opd}`,{
          method: 'GET',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        if(data.code === 200){
            const pegawai = data.data.map((item: any) => ({
              value : item.nip,
              label : item.nama_pegawai,
            }));
            setPegawaiOption(pegawai);
        } else {
            console.log(data.data);
        }
      } catch (err){
        console.log('gagal mendapatkan data pegawai');
      } finally {
        setIsLoading(false);
      }
    };

    const activeOptions = [
      { label: "Aktif", value: true },
      { label: "Tidak Aktif", value: false },
    ];

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const RolesIds = Roles?.map((Roles) => ({
            role_id: Roles.value, // Ubah `value` menjadi `pegawai_id`
        })) || [];
        const formData = {
            //key : value
            nip : data.nip?.value,
            email : data.email,
            password : data.password,
            is_active: data.is_active?.value,
            role: RolesIds,
        };
        // console.log(formData);
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/user/create`, {
                method: "POST",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if(data.code === 201 || data.code === 200){
                AlertNotification("Berhasil", "Berhasil menambahkan data user", "success", 1000);
                router.push("/useropd");
            } else if(data.code === 400){
                AlertNotification("Gagal", `${data.data}`, "error", 3000, true);
            } else {
                AlertNotification("Gagal", `${data.data}`, "error", 3000, true);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Tambah User OPD :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nip"
                    >
                        Pegawai
                    </label>
                    <Controller
                        name="nip"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                ref={field.ref}
                                placeholder="Pilih Pegawai untuk user"
                                value={Nip}
                                options={PegawaiOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (User?.roles == 'super_admin') {
                                        fetchPegawai(SelectedOpd?.value);
                                    } else {
                                        fetchPegawai(User?.kode_opd);
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setNip(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="email"
                    >
                        Email :
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: "Email harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Email"
                                    value={field.value || Email}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setEmail(e.target.value);
                                    }}
                                />
                                {errors.email ?
                                    <h1 className="text-red-500">
                                    {errors.email.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Email Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="password"
                    >
                        Password:
                    </label>
                    <Controller
                        name="password"
                        control={control}
                        rules={{ required: "Password harus terisi" }}
                        render={({ field }) => {
                            return (
                                <>
                                    <div className="flex items-center">
                                        <input
                                            {...field}
                                            className="border px-4 py-2 rounded-lg flex-1"
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Masukkan Password"
                                            value={field.value || Password}
                                            onChange={(e) => {
                                                field.onChange(e);
                                                setPassword(e.target.value);
                                            }}
                                        />
                                        <button
                                            type="button"
                                            className="absolute right-20 text-sm"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                                        </button>
                                    </div>
                                    {errors.password ? (
                                        <h1 className="text-red-500">{errors.password.message}</h1>
                                    ) : (
                                        <h1 className="text-slate-300 text-xs">*Password Harus Terisi</h1>
                                    )}
                                </>
                            );
                        }}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="is_active"
                    >
                        Status
                    </label>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Pilih Status"
                                value={Aktif}
                                options={activeOptions}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (RolesOption.length === 0) {
                                        fetchRoles();
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setAktif(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="role"
                    >
                        Roles
                    </label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Pilih Roles"
                                value={Roles}
                                options={RolesOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                isMulti
                                onMenuOpen={() => {
                                    if (RolesOption.length === 0) {
                                        fetchRoles();
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option || []);
                                    setRoles(option as OptionType[]);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div>
                <ButtonGreen
                    type="submit"
                    className="mt-4 mb-2"
                    disabled={Proses}
                >
                    {Proses ? 
                        <span className="flex">
                            <LoadingButtonClip />
                            Menyimpan...
                        </span> 
                    :
                        "Simpan"
                    }
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/useropd">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}
export const FormEditUserOpd = () => {

    const {
      control,
      handleSubmit,
      reset,
      formState: { errors },
    } = useForm<FormValue>();
    const [Nip, setNip] = useState<OptionTypeString | null>(null);
    const [Email, setEmail] = useState<string>('');
    const [Aktif, setAktif] = useState<OptionTypeBoolean | null>(null);
    const [Roles, setRoles] = useState<OptionType[]>([]);
    const [RolesOption, setRolesOption] = useState<OptionType[]>([]);
    const [IsLoading, setIsLoading] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean | null>(null);
    const [idNull, setIdNull] = useState<boolean | null>(null);
    const {id} = useParams();
    const router = useRouter();
    const token = getToken();

    const fetchRoles = async() => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      setIsLoading(true);
      try{ 
        const response = await fetch(`${API_URL}/role/findall`,{
          method: 'GET',
          headers: {
            Authorization: `${token}`,
            'Content-Type': 'application/json',
          },
        });
        if(!response.ok){
          throw new Error('cant fetch data opd');
        }
        const data = await response.json();
        const role = data.data.map((item: any) => ({
          value : item.id,
          label : item.role,
        }));
        setRolesOption(role);
      } catch (err){
        console.log('gagal mendapatkan data roles');
      } finally {
        setIsLoading(false);
      }
    };

    const activeOptions = [
      { label: "Aktif", value: true },
      { label: "Tidak Aktif", value: false },
    ];

    useEffect(() => {
        const API_URL = process.env.NEXT_PUBLIC_API_URL;
        const fetchUser = async() => {
            try{
                setLoading(true);
                const response = await fetch(`${API_URL}/user/detail/${id}`, {
                    headers: {
                      Authorization: `${token}`,
                      'Content-Type': 'application/json',
                    },
                });
                if(!response.ok){
                    throw new Error('terdapat kesalahan di koneksi backend');
                }
                const result = await response.json();
                const data = result.data;
                if(result.code == 400){
                    setIdNull(true);
                } else if(result.code == 200){
                    setIdNull(false);
                    reset({
                        nip: data.nip || '',
                        email: data.email || '',
                        is_active: data.is_active,
                        role: data.role?.map((item: any) => ({
                            value: item.id,
                            label: item.role,
                        })) || [],
                    });
                    if(data.nip){
                        const nip = {
                            value: data.nip,
                            label: data.nip,
                        }
                        setNip(nip);
                    }
                    setRoles(
                        data.role?.map((item: any) => ({
                            value: item.id,
                            label: item.role,
                        })) || []
                    );
                    setAktif(
                      activeOptions.find((option) => option.value === data.is_active) || null
                    );
                }
            } catch(err) {
                setError('gagal mengambil data sesuai id');
                console.error(err, 'gagal mengambil data sesuai id')
            } finally {
                setLoading(false);
            }
        }
        fetchUser();
    },[id, reset, token]);

    const onSubmit: SubmitHandler<FormValue> = async (data) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const RolesIds = Roles?.map((Roles) => ({
          role_id: Roles.value, // Ubah `value` menjadi `pegawai_id`
      })) || [];
      const formData = {
          //key : value
          nip : data.nip,
          email : data.email,
          is_active: data.is_active?.value || Aktif?.value,
          role: RolesIds,
      };
        // console.log(formData);
        try{
            setProses(true);
            const response = await fetch(`${API_URL}/user/update/${id}`, {
                method: "PUT",
                headers: {
                  Authorization: `${token}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const result = await response.json();
            if(result.code === 200 || result.code === 201){
                AlertNotification("Berhasil", "Berhasil mengubah data user", "success", 1000);
                // AlertNotification(`${result.code}`, `${result.data}`, "success", 1000);
                router.push("/useropd");
            } else {
                AlertNotification(`Gagal`, `${result.data}`, "error", 2000);
                console.log(result);
            }
        } catch(err){
            AlertNotification("Gagal", "cek koneksi internet/terdapat kesalahan pada database server", "error", 2000);
        } finally {
            setProses(false);
        }
    };

    if(loading){
        return (    
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User OPD :</h1>
                <LoadingClip className="mx-5 py-5"/>
            </div>
        );
    } else if(error){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">{error}</h1>
            </div>
        )
    } else if(idNull){
        return (
            <div className="border p-5 rounded-xl shadow-xl">
                <h1 className="uppercase font-bold">Form Edit User OPD :</h1>
                <h1 className="text-red-500 mx-5 py-5">id tidak ditemukan</h1>
            </div>
        )
    }

    return(
    <>
        <div className="border p-5 rounded-xl shadow-xl">
            <h1 className="uppercase font-bold">Form Edit User OPD :</h1>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col mx-5 py-5"
            >
                <h1 className="border border-slate-200 bg-slate-200 rounded-lg p-3">NIP User ini : {Nip?.value}</h1>
                {/* <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="nip"
                    >
                        Pegawai
                    </label>
                    <Controller
                        name="nip"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Pilih pegawai"
                                value={Nip}
                                options={PegawaiOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (RolesOption.length === 0) {
                                        fetchPegawai();
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setNip(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div> */}
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="email"
                    >
                        Email :
                    </label>
                    <Controller
                        name="email"
                        control={control}
                        rules={{ required: "Email harus terisi" }}
                        render={({ field }) => (
                            <>
                                <input
                                    {...field}
                                    className="border px-4 py-2 rounded-lg"
                                    id="tahun"
                                    type="text"
                                    placeholder="masukkan Email"
                                    value={field.value || Email}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        setEmail(e.target.value);
                                    }}
                                />
                                {errors.email ?
                                    <h1 className="text-red-500">
                                    {errors.email.message}
                                    </h1>
                                    :
                                    <h1 className="text-slate-300 text-xs">*Email Harus Terisi</h1>
                                }
                            </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="is_active"
                    >
                        Status
                    </label>
                    <Controller
                        name="is_active"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Pilih Status"
                                value={Aktif}
                                options={activeOptions}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                onMenuOpen={() => {
                                    if (RolesOption.length === 0) {
                                        fetchRoles();
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option);
                                    setAktif(option);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div>
                <div className="flex flex-col py-3">
                    <label
                        className="uppercase text-xs font-bold text-gray-700 my-2"
                        htmlFor="role"
                    >
                        Roles
                    </label>
                    <Controller
                        name="role"
                        control={control}
                        render={({ field }) => (
                        <>
                            <Select
                                {...field}
                                placeholder="Pilih Roles"
                                value={Roles}
                                options={RolesOption}
                                isLoading={IsLoading}
                                isSearchable
                                isClearable
                                isMulti
                                onMenuOpen={() => {
                                    if (RolesOption.length === 0) {
                                        fetchRoles();
                                    }
                                }}
                                onChange={(option) => {
                                    field.onChange(option || []);
                                    setRoles(option as OptionType[]);
                                }}
                                styles={{
                                    control: (baseStyles) => ({
                                    ...baseStyles,
                                    borderRadius: '8px',
                                    textAlign: 'start',
                                    })
                                }}
                            />
                        </>
                        )}
                    />
                </div>
                <ButtonGreen
                    type="submit"
                    className="mt-4 mb-2"
                    disabled={Proses}
                >
                    {Proses ? 
                        <span className="flex">
                            <LoadingButtonClip />
                            Menyimpan...
                        </span> 
                    :
                        "Simpan"
                    }
                </ButtonGreen>
                <ButtonRed type="button" halaman_url="/useropd">
                    Kembali
                </ButtonRed>
            </form>
        </div>
    </>
    )
}