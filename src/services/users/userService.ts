import axios, { AxiosError } from "axios";

// Usa axios directamente para no depender de que haya un usuario logueado.
const BASE_URL = import.meta.env.VITE_API_URL ?? "https://todoback-xkpn.onrender.com";
console.log("[userService] baseURL →", BASE_URL);

const publicClient = axios.create({
  baseURL: BASE_URL,
  timeout: 35000,
  headers: { "Content-Type": "application/json" },
});

export type RegisterPayload = {
  displayName: string;
  email: string;
  password: string;
  passwordConfirm: string;
};

// Registra el usuario en Firebase Y en la BD del backend
export async function registerUser(payload: RegisterPayload): Promise<void> {
  console.log("[registerUser] POST", BASE_URL + "/users");
  try {
    await publicClient.post("/users", payload);
  } catch (err: unknown) {
    // Type narrowing: verificar si es un error de axios
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError;
      console.error("[registerUser] FAILED", {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
        url: BASE_URL + "/users",
      });
    } else {
      // Si no es error de axios, es otro tipo
      console.error("[registerUser] Unknown error", err);
    }
    throw err;
  }
}