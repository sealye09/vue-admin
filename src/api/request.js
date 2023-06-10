import axios from "axios";

const BASE_URL = "http://127.0.0.1:8888/api/private/v1/";

const request = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

export default request;
