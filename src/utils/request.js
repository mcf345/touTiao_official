import axios from "axios";
import store from "@/store";
import JSONBig from "json-bigint";

//创建一个axios实例
//通过axios创建出来的实例跟axios一摸一样
//但是集成了一些配置项
const request = axios.create({
  baseURL: "http://42.192.129.12:8000/",
  transformResponse: [
    function (data) {
      // console.log(data);
      // data json格式 >> 里面可能包含大数字
      try {
        return JSONBig.parse(data);
      } catch (e) {
        return data;
      }
    },
  ],
});

// 设置请求拦截器
request.interceptors.request.use(
  (config) => {
    // config >> 当前的配置项
    // 设置token
    // 判断token是否存在
    const token = store.state?.user?.token;

    // 判断token是否存在
    // 存在 >> 添加请求头
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    // 为了报错
    return Promise.reject(err);
  }
);

// 响应拦截器
request.interceptors.response.use();

// 测试接口请求 >>
// request.get("http://localhost:3000/name").then((res) => {
//   console.log(res);
// });

export default request;
