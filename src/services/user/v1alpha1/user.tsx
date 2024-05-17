import md5 from "md5";
import Cookies from "js-cookie";
import { handlerResponse } from "../../common";

export interface User {
  id: number;
  username: string;
  email: string;
  token: string;
  exp_hour: number;
  start_time: number;
}

const userApi = `${process.env.NEXT_PUBLIC_API ?? ""}${
  process.env.NEXT_PUBLIC_API_VERSION ?? ""
}user/`;
const tokenKey = process.env.NEXT_PUBLIC_TOKEN ?? "ocean-token";

export const UserService = {
  async signIn(email: string, password: string, accessToken: string) {
    const signinRequest = {
      email: email,
      password: password,
      access_token: accessToken,
    };
    signinRequest.password = md5(signinRequest.password);
    const res = await fetch(userApi + "signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(signinRequest),
    });
    return handlerResponse(res);
  },
  async userInfo() {
    const token = Cookies.get(tokenKey);
    const res = await fetch(`${userApi}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return handlerResponse(res);
  },
};
