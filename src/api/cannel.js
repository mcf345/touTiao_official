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

export const fetchAddChannel = (channel) => {
  return request({
    method: "PATCH",
    url: "/v1_0/user/channels",
    data: {
      channels: [channel],
    },
  });
};

/**
 * 删除用户频道
 */
export const deleteUserChannel = (channelId) => {
  return request({
    method: "DELETE",
    url: `/v1_0/user/channels/${channelId}`,
  });
};
