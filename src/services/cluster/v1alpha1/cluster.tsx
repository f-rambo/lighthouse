import Cookies from "js-cookie";
import { handlerResponse, jsonToQueryString } from "../../common";

const clusterApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}cluster`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? "ocean-token";

export const ClusterServices = {
  async getList() {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}/list`, {
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
    const res = await fetch(`${clusterApi}?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async getClusterMockData() {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}/mock`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async saveCluster(data: any) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });
    return handlerResponse(res);
  },
  async deleteCluster(id: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}?id=${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async deleteNode(clusterId: string, nodeId: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(
      `${clusterApi}/node?id=${clusterId}&node_id=${nodeId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handlerResponse(res);
  },
  async setUpCluster(clusterID: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}/setup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: clusterID }),
    });
    return handlerResponse(res);
  },
  async uninstallCluster(clusterID: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}/uninstall?id=${clusterID}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
  async addNode(clusterId: string, nodeid: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${clusterApi}/node`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ id: clusterId, node_id: nodeid }),
    });
    return handlerResponse(res);
  },
  async removeNode(clusterID: string, nodeID: string) {
    const token = Cookies.get(tokenKey);
    const res = await fetch(
      `${clusterApi}/node/remove?id=${clusterID}&node_id=${nodeID}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return handlerResponse(res);
  },
};
