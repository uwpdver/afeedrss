import axios from "axios";
import { StorageKeys } from "../constants";
import { inoreader } from "./inoreader";

const fetch = axios.create({
  baseURL: "/api/inoreader",
  timeout: 60 * 60 * 1000,
});

// 请求拦截器
fetch.interceptors.request.use(
  (config) => {
    const inoreaderToken =
      localStorage && localStorage.getItem(StorageKeys.INOREADER_TOKEN);
    if (inoreaderToken && config.headers) {
      config.headers.Authorization = `Bearer ${inoreaderToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
fetch.interceptors.response.use(
  (response) => {
    const { status, statusText } = response;
    if ((status >= 200 && status < 300) || status === 304) {
      return response;
    } else {
      return Promise.reject({ message: `${status}: ${statusText}` });
    }
  },
  (error) => {
    if (
      error.response?.status === 401 ||
      error.response?.data ===
        "AppId required! Contact app developer. See https://inoreader.dev"
    ) {
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(StorageKeys.INOREADER_TOKEN);
        window.location.reload();
      }
    }
    return Promise.reject(error);
  }
);

const api = { inoreader };

export { api as default, fetch };
