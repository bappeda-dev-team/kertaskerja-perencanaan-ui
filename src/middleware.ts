import { NextRequest, NextResponse } from "next/server";
// import * as jwtDecoded from "jwt-decode";

export function middleware(req: NextRequest) {

    const tokenCookie = req.cookies.get('SESSION');

    if (tokenCookie) {
        // const token = tokenCookie.value;
        // try {
        //     const decodedToken: any = jwtDecoded.jwtDecode(token);
        //     const currentTime = Math.floor(Date.now() / 1000);

        //     // Periksa apakah token telah kedaluwarsa
        //     if (decodedToken.exp < currentTime) {
        //         return NextResponse.redirect(new URL('/perencanaan', req.url));
        //     }

        //     return NextResponse.next();
        // } catch (error) {
        //     console.error('Token decoding failed:', error);
        // }
        return NextResponse.next();
    }

    return NextResponse.redirect(new URL('/perencanaan', req.url));
};

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico|login).*)",
    ],
};
