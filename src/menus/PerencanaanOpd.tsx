import { ReactNode } from "react";
import { TbAlertTriangle, TbBinaryTree, TbBinaryTree2, TbBuildingCommunity, TbBuildingCottage, TbCalendarPlus, TbChartBar, TbFocus2, TbMapPin, TbShoppingCartDollar, TbTarget } from "react-icons/tb";

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const subMenuRenja: MenuItem[] = [
    {
        id: "renja_tujuan_opd",
        name: "Tujuan OPD",
        href: "/Renja/tujuanopd",
        icon: <TbMapPin className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "renja_sasaran_opd",
        name: "Sasaran OPD",
        href: "/Renja/sasaranopd",
        icon: <TbTarget className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "renja_iku_opd",
        name: "IKU OPD",
        href: "/Renja/ikuopd",
        icon: <TbChartBar className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "matrix_renja_opd",
        name: "Matrix Renja",
        href: "/Renja/matrix-renja",
        icon: <TbShoppingCartDollar className="text-xl" />,
        sub_menu: [],
    },
]

const subMenuRenstra: MenuItem[] = [
    {
        id: "permasalahan_opd",
        name: "Permasalahan",
        href: "/permasalahanopd",
        icon: <TbAlertTriangle className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "isu_strategis_opd",
        name: "Isu Strategis",
        href: "/isustrategisopd",
        icon: <TbFocus2 className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "tujuan_opd",
        name: "Tujuan OPD",
        href: "/tujuanopd",
        icon: <TbMapPin className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "sasaran_opd",
        name: "Sasaran OPD",
        href: "/sasaranopd",
        icon: <TbTarget className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "iku_opd",
        name: "IKU OPD",
        href: "/ikuopd",
        icon: <TbChartBar className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "matrix_renstra_opd",
        name: "Matrix Renstra",
        href: "/matrix-renstra",
        icon: <TbShoppingCartDollar className="text-xl" />,
        sub_menu: [],
    },
]

const subMenuPerencanaanOpd: MenuItem[] = [
    {
        id: "pohon_kinerja_opd",
        name: "Pohon Kinerja OPD",
        href: "/pohonkinerjaopd",
        icon: <TbBinaryTree className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "pohon_cascading_opd",
        name: "Pohon Cascading OPD",
        href: "/pohoncascadingopd",
        icon: <TbBinaryTree2 className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "renstra_opd",
        name: "Renstra",
        href: "#",
        icon: <TbBuildingCommunity className="text-xl" />,
        sub_menu: subMenuRenstra,
    },
    {
        id: "renja_opd",
        name: "Renja",
        href: "#",
        icon: <TbBuildingCottage className="text-xl" />,
        sub_menu: subMenuRenja,
    },
    {
        id: "renaksi_opd",
        name: "Rencana Aksi OPD",
        href: "/rencanaaksiopd",
        icon: <TbCalendarPlus className="text-xl" />,
        sub_menu: [],
    },
]

export const PerencanaanOpd: MenuItem =
{
    id: "perencanaan_opd",
    name: "Perencanaan OPD",
    href: "#",
    icon: <TbBuildingCommunity className="text-xl" />,
    sub_menu: subMenuPerencanaanOpd,
}
