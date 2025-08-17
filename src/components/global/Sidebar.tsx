import Image from 'next/image';
import { TbHome, TbChevronRight } from 'react-icons/tb';
import { usePathname } from 'next/navigation';
import { useBrandingContext } from '@/context/BrandingContext';
import Link from 'next/link';
import { TbCircleArrowLeftFilled } from 'react-icons/tb';
import { DataMaster } from '@/menus/DataMaster';
import { DataMasterOpd } from '@/menus/DataMasterOpd';
import { PerencanaanPemda } from '@/menus/PerencanaanPemda'
import { PerencanaanOpd } from '@/menus/PerencanaanOpd'
import { PerencanaanAsn } from '@/menus/PerencanaanAsn'
import { Laporan } from '@/menus/Laporan'
import { User } from '@/types';
import { ReactNode } from "react";
import { useState, useEffect } from "react";

interface SidebarProps {
    isOpen: boolean;
    isZoomed: boolean | null;
    toggleSidebar: () => void;
    user?: User | null;
}

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: ReactNode;
    sub_menu: MenuItem[] | [];
}

const renderSubMenu = (menu: MenuItem, openMenus: Record<string, boolean>, isOpen: boolean, toggleMenu: (id: string) => void, currentUrl: string) => {
    const isOpenMenu = openMenus[menu.id] ?? false;
    if (!menu.sub_menu || menu.sub_menu.length === 0) return null;

    return (
        <>
            {isOpenMenu && (
                <ul className={`transition-all duration-300 ease-in-out px-3 py-2 flex flex-col border-l-2 border-white rounded-b-xl ml-2 max-h-screen opacity-100`}>
                    {menu.sub_menu.map(sub => {
                        const isParent = sub.href === '#';
                        const isSubActive = currentUrl.startsWith(sub.href);
                        return (
                            <div key={sub.id}>
                                {isParent ? (
                                    <li
                                        onClick={() => toggleMenu(sub.id)}
                                        className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 ${isSubActive ? 'bg-slate-500' : ''}`}
                                    >
                                        <div className="flex items-center gap-2">
                                            {sub.icon}
                                            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>
                                                {sub.name}
                                            </span>
                                        </div>
                                        <TbChevronRight className={`transition-all duration-200 ease-in-out ${openMenus[sub.id] ? "rotate-90" : ""}`} />
                                    </li>
                                ) : (
                                    <Link href={sub.href}>
                                        <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 ${isSubActive ? 'bg-slate-500' : ''}`}>
                                            {sub.icon}
                                            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>{sub.name}</span>
                                        </li>
                                    </Link>
                                )}
                                {isParent && renderSubMenu(sub, openMenus, isOpen, toggleMenu, currentUrl)}
                            </div>
                        );
                    })}
                </ul>
            )}
        </>
    );
};

const renderMenuItems = (userMenus: MenuItem[], openMenus: Record<string, boolean>, isOpen: boolean, toggleMenu: (id: string) => void, currentUrl: string) => {
    return userMenus.map(menu => {
        const isParent = menu.href === '#';
        const isActive = currentUrl.startsWith(menu.href);
        if (isParent) {
            return (
                <div key={menu.id}>
                    <li
                        onClick={() => toggleMenu(menu.id)}
                        className={`flex justify-between items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 ${isActive ? 'bg-slate-500' : ''}`}
                    >
                        <div className="flex items-center gap-2">
                            {menu.icon}
                            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>
                                {menu.name}
                            </span>
                        </div>
                        <TbChevronRight className={`transition-all duration-200 ease-in-out ${openMenus[menu.id] ? "rotate-90" : ""}`} />
                    </li>
                    {renderSubMenu(menu, openMenus, isOpen, toggleMenu, currentUrl)}
                </div>
            );
        }

        return (
            <Link key={menu.id} href={menu.href}>
                <li className={`flex items-center gap-x-2 cursor-pointer p-2 rounded-xl hover:bg-slate-500 ${isActive ? 'bg-slate-500' : ''}`}>
                    {menu.icon}
                    <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>{menu.name}</span>
                </li>
            </Link>
        );
    });
};

export default function Sidebar({ isZoomed, isOpen, toggleSidebar, user }: SidebarProps) {
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
    const roles = user?.roles ?? [];
    const { branding } = useBrandingContext();
    const url = usePathname();

    const roleMenus: Record<string, MenuItem[]> = {
        super_admin: [DataMaster, DataMasterOpd, PerencanaanPemda, PerencanaanOpd, Laporan],
        admin_opd: [DataMasterOpd, PerencanaanOpd, Laporan],
        admin_kecamatan: [DataMasterOpd, PerencanaanOpd, Laporan],
        reviewer: [PerencanaanPemda, PerencanaanOpd, Laporan],
        level_1: [PerencanaanAsn],
        level_2: [PerencanaanAsn],
        level_3: [PerencanaanAsn],
        level_4: [PerencanaanAsn],
        staff: [PerencanaanAsn],
    };

    const userMenus: MenuItem[] = roles.flatMap(role => roleMenus[role] ?? []);

    const toggleMenu = (id: string) => {
        setOpenMenus((prev: Record<string, boolean>) => ({
            ...prev,
            [id]: !prev[id],
        }));
    };

    useEffect(() => {
        const newOpenMenus: Record<string, boolean> = {};

        userMenus.forEach(menu => {
            if (url.startsWith(menu.href) && menu.sub_menu && menu.sub_menu.length > 0) {
                newOpenMenus[menu.id] = true;
            }
            menu.sub_menu.forEach(subMenu => {
                if (url.startsWith(subMenu.href)) {
                    newOpenMenus[menu.id] = true;
                }
            });
        });

        setOpenMenus(prev => ({ ...prev, ...newOpenMenus }));
    }, [url]);

    return (
        <aside className="flex">
            {isZoomed && (
                <div
                    className={`fixed top-1 bg-gradient-to-bl from-[#182C4E] to-[#17212D] border border-white p-2 cursor-pointer duration-200 text-white rounded-md z-50 ${!isOpen ? 'rotate-180 ' : 'left-[13rem]'}`}
                    onClick={() => toggleSidebar()}
                >
                    <TbCircleArrowLeftFilled />
                </div>
            )}
            <div className={`bg-gradient-to-bl from-[#182C4E] to-[#17212D] overflow-y-auto text-white h-full ${isOpen ? 'w-64 py-5 px-3' : 'w-0'} duration-300 fixed custom-scrollbar`}>
                <div className="flex items-center justify-center">
                    <Image
                        className="mb-3 transition-all duration-300 ease-in-out"
                        src={branding.logo}
                        alt="logo"
                        width={!isZoomed ? 80 : 80}
                        height={!isZoomed ? 80 : 80}
                    />
                </div>
                {!isZoomed && (
                    <div
                        className={`fixed top-1 p-2 mt-5 cursor-pointer border border-white text-white duration-200 rounded-md z-50 hover:bg-white hover:text-[#182C4E] ${!isOpen ? 'rotate-180 bg-gray-800' : 'left-[13rem]'}`}
                        onClick={toggleSidebar}
                    >
                        <TbCircleArrowLeftFilled />
                    </div>
                )}
                <div className="flex gap-x-4 items-center">
                    <div className={`flex flex-wrap justify-center text-white text-center text-lg ${!isOpen && 'scale-0'} duration-300`}>
                        <h2 className='font-bold uppercase'>
                            {branding.title}
                        </h2>
                        <h3 className='font-thin text-lg'>{branding.client}</h3>
                    </div>
                </div>

                <ul className="pt-6">
                    <Link href="/">
                        <li className={`flex items-center font-medium gap-x-2 cursor-pointer p-2 rounded-xl transition-all duration-300 ${url === "/" ? "bg-white text-gray-800" : "hover:bg-slate-500"}`}>
                            <TbHome className="text-xl" />
                            <span className={`${!isOpen && 'hidden'} origin-left duration-200`}>Dashboard</span>
                        </li>
                    </Link>
                    {renderMenuItems(userMenus, openMenus, isOpen, toggleMenu, url)}
                </ul>
            </div>
        </aside>
    );
}
