import { ButtonSky } from "@/components/global/Button";
import { FiHome } from "react-icons/fi";
import { TbCirclePlus } from "react-icons/tb";
import Table from "@/components/pages/datamaster/masterlembaga/Table";

const masterjabatan = () => {
    return(
        <>
            <div className="flex items-center">
                <a href="/" className="mr-1"><FiHome /></a>
                <p className="mr-1">/ Data Master</p>
                <p className="mr-1">/ Master Lembaga</p>
            </div>
            <div className="mt-3 rounded-xl shadow-lg border">
                <div className="flex items-center justify-between border-b px-5 py-5">
                    <div className="flex flex-col items-end">
                        <h1 className="uppercase font-bold">Daftar Lembaga / Kota / Kabupaten</h1>
                    </div>
                    <div className="flex flex-col">
                        <ButtonSky 
                            className="flex items-center justify-center"
                            halaman_url='/DataMaster/masterlembaga/tambah'
                        >
                            <TbCirclePlus className="mr-1"/>
                            Tambah Lembaga
                        </ButtonSky>
                    </div>
                </div>
                <Table />
            </div>
        </>
    )
}

export default masterjabatan;