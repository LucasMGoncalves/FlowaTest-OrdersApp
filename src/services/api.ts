import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      return Promise.reject(
        new Error("Não foi possível conectar ao servidor.")
      );
    }

    const message = error.response.data?.message;

    return Promise.reject(
      new Error(
        typeof message === "string"
          ? message
          : "Ocorreu um erro ao processar essa requisição."
      )
    );
  }
);

export default api;