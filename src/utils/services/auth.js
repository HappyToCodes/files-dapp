import axios from "axios";
import { baseUrl } from "../config/urls";
import History from "./GlobalNavigation/navigationHistory";
import { web3auth } from "./web3auth";

export function login(
  address,
  signedMessage,
  accessToken,
  refreshToken,
  redirect = "/dashboard"
) {
  let expirationDate = new Date();
  expirationDate = expirationDate.setDate(expirationDate.getDate() + 7);
  localStorage.setItem(
    "authData",
    JSON.stringify({
      userAddress: address,
      expirationDate: expirationDate,
      signedMessage: signedMessage,
      accessToken: accessToken,
      refreshToken: refreshToken,
    })
  );

  window.location.pathname !== redirect
    ? History.navigate(redirect)
    : window.location.reload();
}

export function isLogin() {
  let authData = JSON.parse(localStorage.getItem("authData") || "{}");
  if (
    authData?.["userAddress"] &&
    authData?.["expirationDate"] &&
    authData?.["signedMessage"] &&
    authData?.["accessToken"]
  ) {
    let currentDate = new Date();
    let expirationDate = new Date(authData?.["expirationDate"]);
    return expirationDate.getTime() > currentDate.getTime() ? true : false;
  } else {
    // logout();
    return false;
  }
}

export async function logout() {
  if (web3auth.provider) {
    await web3auth.logout();
  }
  localStorage.removeItem("authData");
  History.push("/", { state: { from: "logout" } });
}

export function getAddress() {
  let address = null;
  if (isLogin()) {
    address = JSON.parse(localStorage.getItem("authData"))["userAddress"];
  }
  return address;
}
export function getSignMessage() {
  let message = null;
  if (isLogin()) {
    message = JSON.parse(localStorage.getItem("authData"))["signedMessage"];
  }
  return message;
}

export async function refreshAccessToken() {
  let token = await axios.get(`${baseUrl}/api/auth/refresh_access_token`, {
    headers: { Authorization: `Bearer ${getRefreshToken()}` },
  });
  console.log(token);
  if (token["status"] === 200) {
    let authData = JSON.parse(localStorage.getItem("authData"));
    authData["accessToken"] = token["data"]["accessToken"];
    localStorage.setItem("authData", JSON.stringify(authData));
  } else {
    logout();
  }
}

export function getAccessToken() {
  let message = null;
  if (isLogin()) {
    message = JSON.parse(localStorage.getItem("authData"))["accessToken"];
  }
  return message;
}
export function getRefreshToken() {
  let message = null;
  if (isLogin()) {
    message = JSON.parse(localStorage.getItem("authData"))["refreshToken"];
  }
  return message;
}
