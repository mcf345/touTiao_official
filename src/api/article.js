import request from "@/utils/request.js";

export const getUserCannel = (params) => {
  return request({
    method: "GET",
    url: "/v1_0/articles",
    params,
  });
};
