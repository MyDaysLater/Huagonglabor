const UserInfoStoreKey = '__USERINFO__';
const TokenStoreKey = '__TOKEN__';
export function getLocalUserInfo() {
  const data = localStorage.getItem(UserInfoStoreKey);
  return JSON.parse(data);
}
export function setLocalUserInfo(data) {
  localStorage.setItem(UserInfoStoreKey, JSON.stringify(data));
}
export function removeLocalUserInfo() {
  localStorage.removeItem(UserInfoStoreKey);
}
export function getLocalToken() {
  const data = localStorage.getItem(TokenStoreKey);
  return JSON.parse(data);
}

export function setLocalToken(data) {
  localStorage.setItem(TokenStoreKey, JSON.stringify(data));
}

export function removeLocalToken() {
  localStorage.removeItem(TokenStoreKey);
}

export default {
  getLocalUserInfo,
  setLocalUserInfo,
  removeLocalUserInfo,
  getLocalToken,
  setLocalToken,
  removeLocalToken
}