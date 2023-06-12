import axios from "axios";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style

const request = axios.create({
  baseURL: "/api",
  timeout: 5000,
  headers: {},
  withCredentials: true,
});

request.interceptors.request.use(
  // 请求拦截
  (config) => {
    // 1.发送网络请求时, 在界面的中间位置显示Loading的组件
    NProgress.start(); // 启动滚动条
    // 2.某一些请求要求用户必须携带token, 如果没有携带, 那么直接跳转到登录页面

    // 3.params/data序列化的操作
    return config;
  },
  (err) => {
    ElMessage({
      showClose: true,
      message: res.meta.msg,
      type: "error",
    });
    console.error(err);
  },
);

request.interceptors.response.use(
  // 响应拦截
  (res) => {
    NProgress.done(); // 关闭滚动条
    return res.data;
  },
  (err) => {
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          console.log("请求错误");
          break;
        case 401:
          console.log("未授权访问");
          break;
        default:
          console.log("其他错误信息");
      }
    }
    ElMessage({
      showClose: true,
      message: res.meta.msg,
      type: "error",
    });
    return err;
  },
);

export default request;
