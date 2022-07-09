import request from "@/utils/request.js";

export const getUserCannel = () => {
  return request({
    method: "GET",
    url: "/v1_0/user/channels",
  });
};

export const fetchAllChannel = () => {
  return request({
    method: "GET",
    url: "/v1_0/channels",
  });
};
