import { ReactNode } from "react";
import { TbBinaryTree, TbBinaryTree2, TbBuildingFortress, TbChecklist, TbShoppingCartDollar } from "react-icons/tb";

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const subMenuPerencanaanAsn: MenuItem[] = [
    {
        id: "pohon_kinerja_opd_asn",
        name: "Pohon Kinerja OPD",
        href: "/pohonkinerjaopd",
        icon: <TbBinaryTree className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "pohon_cascading_opd_asn",
        name: "Pohon Cascading OPD",
        href: "/pohoncascadingopd",
        icon: <TbBinaryTree2 className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "rencana_kinerja_asn",
        name: "Rencana Kinerja",
        href: "/rencanakinerja",
        icon: <TbChecklist className="text-xl" />,
        sub_menu: [],
    },
    {
        id: "rincian_belanja_asn",
        name: "Rincian Belanja",
        href: "/rincianbelanja",
        icon: <TbShoppingCartDollar className="text-xl" />,
        sub_menu: [],
    },
]

export const PerencanaanAsn: MenuItem =
{
    id: "perencanaan_asn",
    name: "Perencanaan",
    href: "#",
    icon: <TbBuildingFortress className="text-xl" />,
    sub_menu: subMenuPerencanaanAsn,
}
