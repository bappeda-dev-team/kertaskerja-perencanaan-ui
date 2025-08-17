import { TbLogin } from "react-icons/tb";
import { useUser } from '@/context/UserContext';

export default function LoginButton() {
    const { authUrl } = useUser();
    return (
        <button
            className="flex items-center justify-center gap-2 px-6 py-3 min-w-[200px] bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600"
            onClick={() => (window.location.href = authUrl)}
        >
            <TbLogin size={20} />
            LOGIN
        </button>
    )
}
