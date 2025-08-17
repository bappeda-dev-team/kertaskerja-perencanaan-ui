'use client'

import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import { ButtonSky } from "@/components/global/Button";
import Table from "@/components/pages/datamaster/masteropd/Table";

const masteropd = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master OPD</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar OPD</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/DataMaster/masteropd/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah OPD
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default masteropd;