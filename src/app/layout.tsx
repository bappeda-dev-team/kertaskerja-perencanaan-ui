import LayoutWrapper from '@/app/LayoutWrapper';
import { BrandingProvider } from "@/context/BrandingContext";
import { UserProvider } from "@/context/UserContext";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html lang="en">
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
