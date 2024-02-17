import md5 from 'md5';
import Cookies from 'js-cookie';
import { handlerResponse } from '../../common';

export interface User {
    id: number;
    username: string;
    email: string;
    token: string;
    exp_hour: number;
}

const userApi = `${process.env.NEXT_PUBLIC_API ?? ''}${process.env.NEXT_PUBLIC_API_VERSION ?? ''}user/`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? 'ocean-token';

export const UserService = {
    async userInfo(reqToken?: string) {
        const token = reqToken ?? Cookies.get(tokenKey);
        const res = await fetch(`${userApi}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return handlerResponse(res);
    },
    async signOut() {
        const token = Cookies.get(tokenKey);
        const res = await fetch(`${userApi}signout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return handlerResponse(res);
    },
    async signIn(email: string, password: string) {
        const user = { email: email, password: password };
        user.password = md5(user.password);
        const res = await fetch(userApi + 'signin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify(user)
        });
        return handlerResponse(res);
    }
};
