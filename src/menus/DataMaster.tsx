import { ReactNode } from "react";
import { TbBuilding, TbBuildingEstate, TbCalendar, TbDatabaseCog, TbFile3D, TbFileChart, TbFileDelta, TbFileDots, TbHexagonLetterR, TbUser, TbUsers, TbFileCode, TbFileCode2 } from "react-icons/tb";

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const subMenuProgramKegiatan: MenuItem[] = [
    {
        id: "master_urusan",
        name: "Urusan",
        href: "/DataMaster/masterprogramkegiatan/urusan",
        icon: <TbFileChart className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_bidang_urusan",
        name: "Bidang Urusan",
        href: "/DataMaster/masterprogramkegiatan/bidangurusan",
        icon: <TbFileDelta className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_program",
        name: "Program",
        href: "/DataMaster/masterprogramkegiatan/program",
        icon: <TbFileDots className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_kegiatan",
        name: "Kegiatan",
        href: "/DataMaster/masterprogramkegiatan/kegiatan",
        icon: <TbFileCode className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_subkegiatan",
        name: "Sub Kegiatan",
        href: "/DataMaster/masterprogramkegiatan/subkegiatan",
        icon: <TbFileCode2 className="text-xl" />,
        sub_menu: []
    },
]

const subMenuDataMaster: MenuItem[] = [
    {
        id: "master_lembaga",
        name: "Master Lembaga",
        href: "/DataMaster/masterlembaga",
        icon: <TbBuildingEstate className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_opd",
        name: "Master OPD",
        href: "/DataMaster/masteropd",
        icon: <TbBuilding className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_periode",
        name: "Master Periode",
        href: "/DataMaster/masterperiode",
        icon: <TbCalendar className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_pegawai",
        name: "Master Pegawai",
        href: "/DataMaster/masterpegawai",
        icon: <TbUsers className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_user",
        name: "Master User",
        href: "/DataMaster/masteruser",
        icon: <TbUser className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_role",
        name: "Master Role",
        href: "/DataMaster/masterrole",
        icon: <TbHexagonLetterR className="text-xl" />,
        sub_menu: []
    },
    {
        id: "master_program_kegiatan",
        name: "Program Kegiatan",
        href: "#",
        icon: <TbFile3D className="text-xl" />,
        sub_menu: subMenuProgramKegiatan,
    },
]

export const DataMaster: MenuItem =
{
    id: "data_master",
    name: "Data Master",
    href: "#",
    icon: <TbDatabaseCog className="text-xl" />,
    sub_menu: subMenuDataMaster,
}
