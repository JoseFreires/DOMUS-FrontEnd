import { NextResponse } from 'next/server';

const PUBLIC_ROUTES = [
    "/",
    "/pages/login",
    "/pages/esqueci_minha_senha",
    "/pages/redefinir-senha",
    "/redefinir-senha",
];

export function proxy(request) {
    const { pathname } = request.nextUrl;


    const isPublicRoute = PUBLIC_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );
 
    if (isPublicRoute) {
        return NextResponse.next();
    }

    const token = request.cookies.get("jwtToken")?.value;
    if(!token) {
        return NextResponse.redirect(new URL("/pages/login", request.url));
    }

    const userRole = request.cookies.get("userRole")?.value || "";


    if (pathname.startsWith("/pages/logs") && !userRole.includes("ROLE_ADMIN")) {
        return NextResponse.redirect(new URL("/pages/home", request.url));
    }

    // if (pathname.startsWith("/pages/funcionarios") && 
    //    (!userRole.includes("ROLE_ADMIN") && !userRole.includes("ROLE_SINDICO"))) {
    //     return NextResponse.redirect(new URL("/pages/home", request.url));
    // }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|img/).*)"],
};