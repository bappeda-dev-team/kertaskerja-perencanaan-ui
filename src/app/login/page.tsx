'use client'

import Image from "next/image";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbEye, TbEyeClosed } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";
import { LoadingButtonClip } from "@/components/global/Loading";
import { login } from "@/components/lib/Cookie";
import { useBrandingContext } from "@/context/BrandingContext";

interface FormValues {
  username: string;
  password: string;
}

const LoginPage = () => {

    const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [Proses, setProses] = useState<boolean>(false);
    const router = useRouter();

    const { branding } = useBrandingContext();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        //   console.log(data.username, data.password);
        setProses(true);
        try{
            const isLoggedIn = await login(data.username, data.password);
            if (isLoggedIn) {
              router.push('/'); // Redirect ke halaman dashboard jika login berhasil
            }
        } catch(error) {
            console.error(error)
        } finally {
            setProses(false);
        }
    };

    return(
        <>
        <div className="flex items-center justify-center w-full h-screen bg-gray-100">
            <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
                <div className="flex flex-col items-center">
                    <Image 
                        src={branding.logo}
                        // src="/universal.png"
                        alt="logo" 
                        width={90}
                        height={90} 
                    />
                    <h1 className="text-2xl font-bold mt-3 text-center uppercase">{branding.title}</h1>
                    <h1 className="text-lg font-thin mb-6 text-center">{branding.client}</h1>
                </div>
                {/* NIP */}
                <div className="mb-4">
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                        NIP
                    </label>
                    <input
                        type="text"
                        id="username"
                        {...register('username', { required: 'nip harus terisi' })}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                    />
                    {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                </div>
                {/* PW */}
                <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                        Password
                    </label>
                    <div className="flex items-center justify-end">
                        <input
                            type={!showPassword ? 'password' : 'text'}
                            id="password"
                            {...register('password', { required: 'password harus terisi' })}
                            className="mt-1 block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                        />
                        <button
                            type="button"
                            className="absolute mt-1 mr-3 text-sm"
                            onClick={() => setShowPassword(!showPassword)}
                            >
                            {showPassword ? <TbEye /> : <TbEyeClosed />}
                        </button>
                    </div>
                    {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                </div>
                {/* <select
                    className="w-full"
                    value={SelectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                >
                    <option value="">pilih role</option>
                    <option value="super_admin">super admin</option>
                    <option value="admin_opd">admin opd</option>
                    <option value="asn">asn</option>
                </select> */}
                <ButtonSky
                    type="submit"
                    className="w-full"
                    disabled={Proses}
                >
                    {Proses ? 
                        <span className="flex">
                            <LoadingButtonClip />
                            Login...
                        </span> 
                    :
                        "Login"
                    }
                </ButtonSky>
            </form>
        </div>
        </>
    )
}

export default LoginPage;