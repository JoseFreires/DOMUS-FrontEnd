import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = ["/pages/login", "/", "/pages/recuperar-senha"];

export function middleware(request) {
    const { pathname } = request.nextUrl;


    if(PUBLIC_ROUTES.some((r) => pathname.startsWith(r))) {
        return NextResponse.next();
    }

    const token = request.cookies.get("token")?.value;
    if(!token) {
        return NextResponse.redirect(new URL("/pages/login", request.url));
    }

    const userRole = request.cookies.get("userRole")?.value || "";


    if (pathname.startsWith("/pages/logs") && !userRole.includes("ROLE_ADMIN")) {
        return NextResponse.redirect(new URL("/pages/home", request.url));
    }

    if (pathname.startsWith("/pages/funcionarios") && 
       (!userRole.includes("ROLE_ADMIN") && !userRole.includes("ROLE_SINDICO"))) {
        return NextResponse.redirect(new URL("/pages/home", request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|img/).*)"],
};