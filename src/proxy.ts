import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
    //regarde dans le portefeuille s'il y a un Cookie nommé "token"
    const token = request.cookies.get('token')?.value;

    //regarde devant quelle porte l'utilisateur se trouve
    const isLoginPage = request.nextUrl.pathname === '/login';

    // Règle A : Pas de token et essaie d'entrer ailleurs que sur la page Login ?
    if (!token && !isLoginPage) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Règle B : Il a un token mais essaie d'aller sur la page Login ?
    if (token && isLoginPage) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Règle C : Tout est en règle, on le laisse passer
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
