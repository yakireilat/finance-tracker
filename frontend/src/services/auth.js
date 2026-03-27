import api from "./api";

export async function register(email, password, fullName) {
  const response = await api.post("/auth/register", {
    email,
    password,
    full_name: fullName,
  });
  return response.data;
}

export async function login(email, password) {
  // FastAPI expects form data for login, not JSON
  const form = new URLSearchParams();
  form.append("username", email);
  form.append("password", password);

  const response = await api.post("/auth/login", form);
  const { access_token } = response.data;

  localStorage.setItem("token", access_token);
  return access_token;
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}
