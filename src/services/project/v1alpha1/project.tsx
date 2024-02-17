import Cookies from 'js-cookie';
import { handlerResponse, jsonToQueryString } from '../../common';

const clusterApi = `${process.env.NEXT_PUBLIC_API ?? ''}${process.env.NEXT_PUBLIC_API_VERSION ?? ''}project`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? 'ocean-token';

export const ProjectServices = {
    async getList(clusterID: string) {
        const token = Cookies.get(tokenKey);
        const res = await fetch(`${clusterApi}/list?cluster_id=${clusterID}`, {
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
