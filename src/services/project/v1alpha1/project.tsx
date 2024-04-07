import Cookies from "js-cookie";
import { handlerResponse, jsonToQueryString } from "../../common";
import { json } from "stream/consumers";

const projectApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}project`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? "ocean-token";

export const ProjectServices = {
  async getList(clusterID: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}/list?cluster_id=${clusterID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async getDetail(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async save(project: any) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(project),
    });
    return handlerResponse(res);
  },
  async delete(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async getProjectMockData() {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}/mock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async enable(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}/enable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
    });
    return handlerResponse(res);
  },
  async disable(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${projectApi}/disable`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: id }),
    });
    return handlerResponse(res);
  },
};
