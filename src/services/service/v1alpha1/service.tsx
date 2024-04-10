import Cookies from "js-cookie";
import { handlerResponse, jsonToQueryString } from "../../common";
import { json } from "stream/consumers";

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
};
