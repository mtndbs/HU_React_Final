import { User } from "../services/Interfaces";

const tokenKey = "token";
const userKey = "user";

export function setToken(tokenValue?: string) {
  if (!tokenValue) return;
  localStorage.setItem(tokenKey, tokenValue);
}

export function setUser(user: User) {
  if (!user) return;
  const stringfyUser = JSON.stringify(user);
  localStorage.setItem(userKey, stringfyUser);
}

export function getUser(): User | undefined {
  const user = localStorage.getItem(userKey);
  if (!user) return;
  const parsedUser = JSON.parse(user);
  return parsedUser;
}

export function removeUser() {
  localStorage.removeItem(userKey);
  localStorage.removeItem(tokenKey);
  window.location.reload();
}

export function getToken(): string {
  return localStorage.getItem(tokenKey) || "";
}

export function removeToken() {
  localStorage.removeItem(tokenKey);
  window.location.reload();
}

export function verifyToken(): boolean {
  return getToken().length > 0;
}
export function verifyBiz(): boolean {
  return getUser()?.bizChecked ? true : false;
}
export function verifyAdmin(): boolean {
  return getUser()?.role === "admin" ? true : false;
}

export function verifyUiToken(userData: User): boolean {
  if (userData && userData.role) {
    return true;
  }
  return false;
}

export function verifyUiAdmin(userData: User): boolean {
  if (userData && userData.role === "admin") {
    return true;
  }
  return false;
}
