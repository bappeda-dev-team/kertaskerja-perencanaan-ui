import { Poppins } from "next/font/google";
import LayoutWrapper from '@/app/LayoutWrapper';
import { BrandingProvider } from "@/context/BrandingContext";
import { UserProvider } from "@/context/UserContext";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

const font = Poppins({
    subsets: ['latin'],
    weight: ['200', '300', '400', '500', '600', '700', '800'],
    display: 'swap', // Mengatur tampilan swap agar tidak ada flash saat font dimuat
});

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en" className={font.className}>
            <body className="flex">
                <UserProvider>
                    <BrandingProvider>
                        <NextTopLoader color="linear-gradient(to right, rgb(134, 239, 172), rgb(59, 130, 246), rgb(147, 51, 234))" />
                        {/* Sidebar + Header dipindahkan ke client component */}
                        <LayoutWrapper>{children}</LayoutWrapper>
                    </BrandingProvider>
                </UserProvider>
            </body>
        </html>
    );
}
