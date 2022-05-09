import { fetch } from "./index";

const getInoreaderAuthURI = () =>
  fetch.get(`/inoreader/authURI`, {
    baseURL: process.env.INOREADER_AUTH_URL,
  });

const getInoreaderAccessToken = (code: string) =>
  fetch.get(`/inoreader/token?code=${code}`, {
    baseURL: process.env.INOREADER_AUTH_URL
  });

export const auth = {
  getInoreaderAuthURI,
  getInoreaderAccessToken,
};
