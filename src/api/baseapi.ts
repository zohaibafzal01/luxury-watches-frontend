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
  const state = store.getState();
  const user = selectUserInfo(state);

  showToast("Session Expired", "Your session has expired. Please login again.");

  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
  store.dispatch(login(null));

  const redirectUrl =
    user?.accountType === "admin" || user?.role === "admin"
      ? "/admin/login"
      : "/login";

  setTimeout(() => {
    window.location.href = redirectUrl;
  }, 3000);
};

export const checkTokenExpiration = () => {
  const state = store.getState();
  const userFromRedux = selectUserInfo(state);
  const userFromStorage = localStorage.getItem("user");
  const isAuthenticatedFromStorage =
    localStorage.getItem("isAuthenticated") === "true";

  if (!userFromStorage && !isAuthenticatedFromStorage && userFromRedux) {
    showToast(
      "Session Cleared",
      "Your session was cleared. Redirecting to login..."
    );
    store.dispatch(login(null));

    setTimeout(() => {
      const redirectUrl =
        userFromRedux?.accountType === "admin" ||
        userFromRedux?.role === "admin"
          ? "/admin/login"
          : "/login";
      window.location.href = redirectUrl;
    }, 2000);
    return false;
  }

  if (!userFromRedux && !userFromStorage) {
    return true;
  }

  const token = userFromRedux?.token;
  if (token && isTokenExpired(token)) {
    handleAutoLogout();
    return false;
  }

  return true;
};

const showToast = (title: string, message: string): boolean => {
  try {
    // Remove any existing toasts
    document
      .querySelectorAll('[data-toast="session-expired"]')
      .forEach((toast) => toast.remove());

    const toast = document.createElement("div");
    toast.setAttribute("data-toast", "session-expired");
    toast.style.cssText = `
      position: fixed !important;
      top: 20px !important;
      right: 20px !important;
      background: #ff5757 !important;
      color: white !important;
      padding: 16px 20px !important;
      border-radius: 8px !important;
      box-shadow: 0 4px 12px rgba(255, 87, 87, 0.3) !important;
      z-index: 999999 !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      width: 300px !important;
      transform: translateX(320px) !important;
      transition: all 0.3s ease-out !important;
    `;

    toast.innerHTML = `
      <div style="
        font-weight: 600; 
        font-size: 14px; 
        color: white; 
        margin-bottom: 4px;
      ">${title}</div>
      <div style="
        font-size: 13px; 
        color: rgba(255, 255, 255, 0.9); 
        line-height: 1.4;
      ">${message}</div>
    `;

    // Add simple styles
    if (!document.querySelector("#simple-toast-styles")) {
      const style = document.createElement("style");
      style.id = "simple-toast-styles";
      style.textContent = `
        @keyframes slideInSimple {
          from { transform: translateX(320px) !important; }
          to { transform: translateX(0) !important; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(toast);

    // Simple slide-in animation
    setTimeout(() => {
      toast.style.animation = "slideInSimple 0.3s ease-out";
      toast.style.transform = "translateX(0)";
    }, 10);

    return true;
  } catch (error) {
    return false;
  }
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
    const response = await this.axiosInstance.patch<T>(url, config);
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
