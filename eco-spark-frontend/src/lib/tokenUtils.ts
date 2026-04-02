import { getCookieValue } from "./cookieUtils";
import { isTokenExpiringSoon } from "./jwtUtils";

export const getAccessToken = async (): Promise<string | undefined> => {
  return getCookieValue("accessToken");
};

export const getRefreshToken = async (): Promise<string | undefined> => {
  return getCookieValue("refreshToken");
};

export const shouldRefreshAccessToken = async (): Promise<boolean> => {
  const accessToken = await getAccessToken();
  return isTokenExpiringSoon(accessToken);
};
