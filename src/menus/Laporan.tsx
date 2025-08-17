import { ReactNode } from "react";
import { TbBook, TbBuildingCommunity, TbChartBar, TbChecklist, TbClipboardText, TbDeviceImacDollar, TbListDetails, TbMapPin, TbTarget, TbZoomExclamation } from "react-icons/tb";

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const subMenuLaporanRenstraOpd: MenuItem[] = [
    {
        id: "laporan_review_tujuan_opd",
        name: "Tujuan OPD",
        href: "/tujuanopdview",
        icon: <TbMapPin className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_review_sasaran_opd",
        name: "Sasaran OPD",
        href: "/sasaranopdview",
        icon: <TbTarget className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_matrix_renstra",
        name: "Matrix Renstra",
        href: "/laporanrenstra",
        icon: <TbChartBar className="text-xl" />,
        sub_menu: [],
    },
]

const subMenuLaporanReviewPokin: MenuItem[] = [
    {
        id: "laporan_review_pokin_pemda",
        name: "Review Pemda",
        href: "/reviewpemda",
        icon: <TbZoomExclamation className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_review_pokin_opd",
        name: "Review OPD",
        href: "/reviewopd",
        icon: <TbZoomExclamation className="text-xl" />,
        sub_menu: [],
    },
]

const subMenuLaporan: MenuItem[] = [
    {
        id: "list_opd_tematik",
        name: "List OPD di Tematik",
        href: "/listopd",
        icon: <TbListDetails className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_review_pokin",
        name: "Review Pokin",
        href: "#",
        icon: <TbClipboardText className="text-xl" />,
        sub_menu: subMenuLaporanReviewPokin,
    },
    {
        id: "laporan_renstra_opd",
        name: "Renstra OPD",
        href: "#",
        icon: <TbBuildingCommunity className="text-xl" />,
        sub_menu: subMenuLaporanRenstraOpd,
    },
    {
        id: "laporan_rencana_kinerja_kak",
        name: "Rencana Kinerja KAK",
        href: "#",
        icon: <TbChecklist className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_rencana_kinerja_kak",
        name: "Rencana Kinerja KAK",
        href: "#",
        icon: <TbChecklist className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_rincian_belanja_kak",
        name: "Rincian Belanja",
        href: "/laporanrincianbelanja",
        icon: <TbDeviceImacDollar className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_cascading_pemda",
        name: "Cascading PEMDA",
        href: "/laporancascadingopd",
        icon: <TbListDetails className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "laporan_cascading_opd",
        name: "Cascading OPD",
        href: "/laporancascadingopd",
        icon: <TbListDetails className="text-xl" />,
        sub_menu: [],
    },
]

export const Laporan: MenuItem =
{
    id: "laporan",
    name: "Laporan",
    href: "#",
    icon: <TbBook className="text-xl" />,
    sub_menu: subMenuLaporan,
}
