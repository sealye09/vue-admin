import axios from "axios";
import router from "@/router";
// import { ElMessage } from "element-plus";

const BASE_URL = "/api";
const TIMEOUT = 20000;

// config
const request = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true,
});

// request interceptor
request.interceptors.request.use(
  (config) => {
    const local = localStorage.getItem("user-store");
    if (local === null) {
      router.push("/login");
      return Promise.reject(new Error("未登入"));
    }
    config.headers.Authorization = localStorage.getItem("user-store").token;
    return config;
  },

  (error) => {
    return Promise.reject(new Error(error));
  },
);

// response interceptor
request.interceptors.response.use(
  (res) => {
    return res.data;
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = "请求错误";
          break;
        case 401:
          err.message = "未授权的访问";
          break;
        case 403:
          err.message = "禁止访问";
          break;
        case 404:
          err.message = "请求地址错误";
          break;
        default:
          err.message = `连接错误${err.response.status}`;
      }
    }
    // ElMessage({
    //   type: "error",
    //   message: err.message,
    // });
    return Promise.reject(err);
  },
);

export default request;
