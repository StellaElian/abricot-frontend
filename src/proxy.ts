import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    //regarde s'il y a un "token"
    const token = request.cookies.get('token')?.value;

    //l'user se trouve où ?
    const isLoginPage = request.nextUrl.pathname === '/login';

    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Tout est en règle, on le laisse passer
    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/projects/:path*',
        '/tasks/:path*',
        '/login'
    ],
};
