import axios from "axios";
import { getSession } from "next-auth/react";

const fetch = axios.create({
  baseURL: process.env.INOREADER_SERVER_URL || "/api/inoreader",
  timeout: 60 * 60 * 1000,
});

// 请求拦截器
fetch.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session) {
      config.headers!.Authorization = `Bearer ${session.accessToken}`;
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
      error.response?.status === 403 ||
      error.response?.status === 401 ||
      error.response?.data ===
        "AppId required! Contact app developer. See https://inoreader.dev"
    ) {
      if(typeof window !== 'undefined'){
        window.location.pathname = '/auth/signin'
      }
    }
    return Promise.reject(error);
  }
);

export default fetch;