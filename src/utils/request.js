import axios from "axios";
import { ElMessage } from "element-plus";

import useUserStore from "@/store/modules/userStore";

const request = axios.create({
  //基础路径上会携带/api
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 10000, //超时的时间的设置
});

request.interceptors.request.use((config) => {
  //获取用户相关的小仓库:获取仓库内部token,登录成功以后携带给服务器
  const userStore = useUserStore();
  if (userStore.token) {
    config.headers.token = userStore.token;
  }
  //config配置对象,headers属性请求头,经常给服务器端携带公共参数
  //返回配置对象
  return config;
});

request.interceptors.response.use(
  (response) => {
    //成功回调
    //简化数据
    return response.data;
  },
  (error) => {
    //失败回调:处理http网络错误的
    //定义一个变量:存储网络错误信息
    let message = "";
    //http状态码
    const status = error.response.status;
    switch (status) {
      case 401:
        message = "TOKEN过期";
        break;
      case 403:
        message = "无权访问";
        break;
      case 404:
        message = "请求地址错误";
        break;
      case 500:
        message = "服务器出现问题";
        break;
      default:
        message = "网络出现问题";
        break;
    }

    ElMessage({
      type: "error",
      message,
    });
    return Promise.reject(error);
  }
);

export default request;
