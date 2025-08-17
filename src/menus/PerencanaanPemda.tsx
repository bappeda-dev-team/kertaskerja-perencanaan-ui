import { ReactNode } from "react";
import { TbBinaryTree, TbBuildingFortress, TbCalendarShare, TbCalendarStar, TbChartBar, TbHexagonLetterC, TbHexagonLetterI, TbHexagonLetterM, TbHexagonLetterO, TbHexagonLetterV, TbMapPin, TbTarget } from "react-icons/tb";

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const subMenuRKPD: MenuItem[] = [
    {
        id: "rkpd_tujuan_pemda",
        name: "Tujuan Pemda",
        href: "/RKPD/tujuanpemda",
        icon: <TbMapPin className="text-xl" />,
        sub_menu: []
    },
    {
        id: "rkpd_sasaran_pemda",
        name: "Visi",
        href: "/RKPD/sasaranpemda",
        icon: <TbTarget className="text-xl" />,
        sub_menu: []
    },
    {
        id: "rkpd_iku_pemda",
        name: "IKU",
        href: "/RKPD/ikupemda",
        icon: <TbChartBar className="text-xl" />,
        sub_menu: []
    },
]

const subMenuRPJMD: MenuItem[] = [
    {
        id: "visi",
        name: "Visi",
        href: "/visi",
        icon: <TbHexagonLetterV className="text-xl" />,
        sub_menu: []
    },
    {
        id: "misi",
        name: "Misi",
        href: "/misi",
        icon: <TbHexagonLetterM className="text-xl" />,
        sub_menu: []
    },
    {
        id: "tujuan_pemda",
        name: "Tujuan Pemda",
        href: "/tujuanpemda",
        icon: <TbMapPin className="text-xl" />,
        sub_menu: []
    },
    {
        id: "sasaran_pemda",
        name: "Sasaran Pemda",
        href: "/sasaranpemda",
        icon: <TbTarget className="text-xl" />,
        sub_menu: []
    },
    {
        id: "ikupemda",
        name: "IKU",
        href: "/ikupemda",
        icon: <TbChartBar className="text-xl" />,
        sub_menu: []
    },
]

const subMenuIsuStrategis: MenuItem[] = [
    {
        id: "csf",
        name: "CSF",
        href: "/CSF",
        icon: <TbHexagonLetterC className="text-xl" />,
        sub_menu: []
    },
    {
        id: "outcome",
        name: "OUTCOME",
        href: "/outcome",
        icon: <TbHexagonLetterO className="text-xl" />,
        sub_menu: []
    },
    {
        id: "intermediate",
        name: "Intermediate",
        href: "/intermediate",
        icon: <TbHexagonLetterI className="text-xl" />,
        sub_menu: []
    },
]

const subMenuPerencanaanPemda: MenuItem[] = [
    {
        id: "tematik",
        name: "Tematik",
        href: "/tematikpemda",
        icon: <TbBinaryTree className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "isu_strategis_pemda",
        name: "Isu Stategis",
        href: "#",
        icon: <TbCalendarShare className="text-xl" />,
        sub_menu: subMenuIsuStrategis
    },
    {
        id: "pokin_pemda",
        name: "Pohon Kinerja Pemda",
        href: "/pohonkinerjapemda",
        icon: <TbBinaryTree className="text-xl" />,
        sub_menu: []
    },
    {
        id: "rpjmd",
        name: "RPJMD",
        href: "#",
        icon: <TbCalendarShare className="text-xl" />,
        sub_menu: subMenuRPJMD
    },
    {
        id: "rkpd",
        name: "RKPD",
        href: "#",
        icon: <TbCalendarStar className="text-xl" />,
        sub_menu: subMenuRKPD
    },
]

export const PerencanaanPemda: MenuItem =
{
    id: "perencanaan_pemda",
    name: "Perencanaan Pemda",
    href: "#",
    icon: <TbBuildingFortress className="text-xl" />,
    sub_menu: subMenuPerencanaanPemda,
}
