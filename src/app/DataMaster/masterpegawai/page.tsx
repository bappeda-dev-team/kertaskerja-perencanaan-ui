import Table from "@/components/pages/datamaster/masterpegawai/Table";
import { ButtonSky } from "@/components/global/Button";
import { TbCirclePlus } from "react-icons/tb";
import { FiHome } from "react-icons/fi";

const masterpegawai = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Pegawai</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar Pegawai</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/DataMaster/masterpegawai/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah Pegawai
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default masterpegawai;