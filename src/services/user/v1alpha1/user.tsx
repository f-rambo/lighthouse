import { handlerResponse } from "../../common";

const userApi = `${process.env.HOST ?? ""}${
  process.env.PORT ?? ""
}/api/backend/user`;

export const UserService = {
  async userInfo() {
    const res = await fetch(`${userApi}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });
    return handlerResponse(res);
  },
};
