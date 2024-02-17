import Cookies from 'js-cookie';
import { handlerResponse, jsonToQueryString } from '../../common';

const clusterApi = `${process.env.NEXT_PUBLIC_API ?? ''}${process.env.NEXT_PUBLIC_API_VERSION ?? ''}cluster`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? 'ocean-token';

export const ClusterServices = {
    async getList() {
        const token = Cookies.get(tokenKey);
        const res = await fetch(`${clusterApi}/list`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return handlerResponse(res);
    },
    async getDetail(id: string) {
        const token = Cookies.get(tokenKey);
        const res = await fetch(`${clusterApi}?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            }
        });
        return handlerResponse(res);
    }
};
