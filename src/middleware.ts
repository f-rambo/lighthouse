import { NextRequest, NextResponse } from 'next/server';
import { UserService,User } from '@/services/user/v1alpha1/user';

export default async function Middleware(request: NextRequest) {
    const tokenKeyMaxAge = 60 * 60 * 24;
    const userKeyMaxAge = 30 * 60 * 24;
    try {
        const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? 'ocean-token'
        const userKey = process.env.NEXT_PUBLIC_USER ?? 'ocean-user'
        const token = request.cookies.get(tokenKey);
        const user = request.cookies.get(userKey);
        if (user) {
            const dateTime = new Date();
            const userObj = JSON.parse(user.value);
            const startDateTime = new Date(userObj.start_time);
            const diffTime = dateTime.getTime() - startDateTime.getTime();
            if (diffTime > 60 * 60 * 1000) {
                return NextResponse.next();
            }
        }
        const data = await UserService.userInfo(token?.value);
        if (data instanceof Error) {
            throw data;
        }
        let userInfo = data as User
        userInfo.start_time = new Date().getTime();
        const response = NextResponse.next()
        response.cookies.set({
            name: tokenKey,
            value: userInfo.token,
            path: '/',
            maxAge: tokenKeyMaxAge 
        })
        response.cookies.set({
            name: userKey,
            value: JSON.stringify(userInfo),
            path: '/',
            maxAge: userKeyMaxAge
        })
        return response;
    } catch (error) {
        console.log('middleware error:', error);
        return NextResponse.redirect(new URL('/auth/login', request.url));
    }
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico|auth|themes|layout|demo|auth/login).*)',
    ],
};
