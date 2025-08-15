import axios from "axios";
import { store } from "@/redux/store";
import { selectUserInfo } from "@/redux/selectors/userSelectors";
import { login } from "@/redux/slices/userSlice";

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
};

const handleAutoLogout = () => {
  showToast("Session Expired", "Your session has expired. Please login again.");

  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");

  store.dispatch(login(null));

  const state = store.getState();
  const user = selectUserInfo(state);

  setTimeout(() => {
    if (user?.accountType === "admin") {
      window.location.href = "/admin/login";
    } else {
      window.location.href = "/login";
    }
  }, 3000);
};

const showToast = (title: string, message: string) => {
  const toast = document.createElement("div");
  toast.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ef4444;
    color: white;
    padding: 16px 20px;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    z-index: 10000;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    max-width: 350px;
    animation: slideIn 0.3s ease-out;
  `;

  toast.innerHTML = `
    <div style="font-weight: 600; margin-bottom: 4px;">${title}</div>
    <div style="font-size: 14px; opacity: 0.9;">${message}</div>
  `;

  if (!document.querySelector("#toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = "slideOut 0.3s ease-in";
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 2700);
};

export default class BaseApi {
  protected axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
  });

  constructor() {
    this.axiosInstance.interceptors.request.use(
      (config) => {
        const state = store.getState();
        const token = selectUserInfo(state)?.token;

        if (token) {
          if (isTokenExpired(token)) {
            handleAutoLogout();
            throw new Error("Token expired");
          }

          config.headers = {
            ...config.headers,
            Authorization: `Bearer ${token}`,
          };
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.axiosInstance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          handleAutoLogout();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T = any>(url: string, config?: any): Promise<T> {
    const response = await this.axiosInstance.get<T>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, body: any, config?: any): Promise<T> {
    const isFormData =
      typeof FormData !== "undefined" && body instanceof FormData;

    const finalConfig = {
      ...config,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(config?.headers || {}),
      },
    };

    const response = await this.axiosInstance.post<T>(url, body, finalConfig);
    return response.data;
  }

  async patch<T = any>(url: string, body: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.patch<T>(url, body, config);
    return response.data;
  }

  async put<T = any>(url: string, body: any, config?: any): Promise<T> {
    const response = await this.axiosInstance.put<T>(url, body, config);
    return response.data;
  }

  async delete<T = any>(url: string, body?: any, config?: any): Promise<T> {
    const finalConfig = config || {};
    if (body) finalConfig.data = body;
    const response = await this.axiosInstance.delete<T>(url, finalConfig);
    return response.data;
  }
}
