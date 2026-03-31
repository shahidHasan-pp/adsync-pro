const TOKEN_KEY = "adsync_token";
const USER_EMAIL_KEY = "adsync_user_email";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setSession(token, email) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_EMAIL_KEY, email);
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_EMAIL_KEY);
}

export function getUserEmail() {
  return localStorage.getItem(USER_EMAIL_KEY);
}
