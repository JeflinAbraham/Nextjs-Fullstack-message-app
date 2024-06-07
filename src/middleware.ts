import { NextRequest, NextResponse } from 'next/server';



// getToken: to retrieve the user's authentication token ( The user must have a valid session and be authenticated)
import { getToken } from 'next-auth/jwt';


export { default } from 'next-auth/middleware';

// The config object defines the URL paths that the middleware should apply to.
export const config = {
    matcher: ['/dashboard/:path*', '/sign-in', '/sign-up', '/', '/verify/:path*'],
};

export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request });

    // request.nextUrl: represents the URL of the current request.
    const url = request.nextUrl;



    // If the token is present, it means the user is already authenticated (the user has a valid session).
    // the user is already authenticated but is trying to access one of the authentication-related pages (sign-in, sign-up, verify, or home). In this case, the middleware redirects the user to the /dashboard route.
    if (
        token &&
        (url.pathname.startsWith('/sign-in') ||
            url.pathname.startsWith('/sign-up') ||
            url.pathname.startsWith('/verify') ||
            url.pathname === '/')
    ) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }



    // the user is not authenticated (i.e., does not have a valid token) and is trying to access the /dashboard route
    if (!token && url.pathname.startsWith('/dashboard')) {
        return NextResponse.redirect(new URL('/sign-in', request.url));
    }


    //  continue to the next middleware
    return NextResponse.next();
}