import { fetch, INOREADER_AUTH_URL } from "./index";

const getInoreaderAuthURI = () =>
  fetch.get(`/inoreader/authURI`, {
    baseURL: INOREADER_AUTH_URL,
  });

const getInoreaderAccessToken = (code: string) =>
  fetch.get(`/inoreader/token?code=${code}`, {
    baseURL: INOREADER_AUTH_URL
  });

export const auth = {
  getInoreaderAuthURI,
  getInoreaderAccessToken,
};
