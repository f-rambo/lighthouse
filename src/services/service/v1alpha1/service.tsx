import Cookies from "js-cookie";
import { handlerResponse, jsonToQueryString } from "../../common";
import { json } from "stream/consumers";
import { Save } from "lucide-react";

const serviceApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}service`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? "ocean-token";

export const ServiceServices = {
  async getList({
    name: name,
    project_id: projectID,
    page: page,
    page_size: pageSize,
  }: {
    project_id: string;
    name: string;
    page: number;
    page_size: number;
  }) {
    const token = Cookies.get(tokenKey);
    const param = jsonToQueryString({
      project_id: projectID,
      name: name,
      page: page,
      page_size: pageSize,
    });
    const res = await fetch(`${serviceApi}/list?${param}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async save(service: any) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${serviceApi}/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(service),
    });
    return handlerResponse(res);
  },
  async get(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${serviceApi}/get?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async delete(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${serviceApi}/delete?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
};
