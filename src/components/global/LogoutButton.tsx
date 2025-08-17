import { TbLogout } from "react-icons/tb";
import { useUser } from '@/context/UserContext';
import { useEffect, useState } from 'react'

export default function LogoutButton() {
    const [csrfToken, setCsrfToken] = useState<string>("");

    useEffect(() => {
        // find token
        const cookieValue = document.cookie
            .split('; ')
            .find(row => row.startsWith('XSRF-TOKEN='))
            ?.split('=')[1];

        if (cookieValue) {
            setCsrfToken(decodeURIComponent(cookieValue))
        }
    }, [])

    return (
        <form action="/logout" method="POST">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <button className="flex font-medium items-center gap-x-2 cursor-pointer p-2 hover:bg-slate-500 rounded-xl"
                type="submit">
                <TbLogout className="text-xl text-red-500" />
                <span className={`origin-left duration-200`}>Logout</span>
            </button>
        </form>
    )
}
