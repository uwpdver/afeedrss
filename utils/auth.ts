import OAuth from "oauth";
import qs from "query-string";

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const INOREADER_SERVER_URL = process.env.INOREADER_SERVER_URL;

interface OAuth2Token {
  accessToken: string;
  refreshToken: string;
  result: any;
}

export function getAuthUri() {
  const CSRF_PROTECTION_STRING = "111";

  const query = qs.stringify({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "read write",
    state: CSRF_PROTECTION_STRING,
  });
  const authUri = `${INOREADER_SERVER_URL}/oauth2/auth?${query}`;
  return authUri;
}

export async function getAccessToken(code: string) {
  if (!CLIENT_ID || !CLIENT_SECRET) return;
  var OAuth2 = OAuth.OAuth2;
  var oauth2 = new OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    `${INOREADER_SERVER_URL}/`,
    "oauth2/auth",
    "oauth2/token"
  );

  return new Promise<OAuth2Token>((resolve, reject) => {
    oauth2.getOAuthAccessToken(
      code,
      {
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      },
      function (err, accessToken, refreshToken, result) {
        if (err) {
          reject(err);
        } else {
          resolve({ accessToken, refreshToken, result });
        }
      }
    );
  });
}
