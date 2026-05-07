const TOKEN_KEY = "eventhive_token";
const USER_KEY = "eventhive_user";

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);

export const removeToken = () => localStorage.removeItem(TOKEN_KEY);

export const getUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setUser = (user) => localStorage.setItem(USER_KEY, JSON.stringify(user));

export const removeUser = () => localStorage.removeItem(USER_KEY);

export const isAuthenticated = () => {
  return !!getToken();
};

export const isLoggedIn = () => getToken() !== null;

export const isOrganiser = () => {
  const user = getUser();
  return user?.role === "organiser";
};

export const login = (token, user) => {
  setToken(token);
  setUser(user);
};

export const logout = () => {
  removeToken();
  removeUser();
  window.location.href = "/login";
};