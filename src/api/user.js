import request from "@/utils/request.js";
// import store from "@/store";

// 登录
export const Login = (data) => {
  return request({
    method: "POST",
    url: "/v1_0/authorizations",
    data,
  });
};

// 获取验证码接口
export const getSend = (mobile) => {
  return request({
    method: "GET",
    url: `/v1_0/sms/codes/${mobile}`,
  });
};

// 需求：获取用户资料
// my/idnex.vue 封装请求的方法，created钩子内部进行调用
// 接口 >> 需要权限
// headers: { Authorization: 'Breare token' }
// 获取用户信息接口
export const getUserInfo = () => {
  return request({
    method: "GET",
    url: "/v1_0/user",
    // headers: {
    //   Authorization: `Bearer ${store.state.user.token}`,
    // },
  });
};
