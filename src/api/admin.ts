import { User } from "@/types/auth";
import BaseApi from "./baseapi";

class AdminApi extends BaseApi {
  baseUrl: string = "admin";
  constructor() {
    super();
  }

  async getAdminUsers(page = 1, limit = 10) {
    const data = await this.get(
      `${this.baseUrl}/user?page=${page}&limit=${limit}`
    );
    return data;
  }

  async activateUser(email: string) {
    return await this.patch(`${this.baseUrl}/activate-user`, {
      email,
    });
  }

  async deactivateUser(email: string) {
    return await this.patch(`${this.baseUrl}/deactivate-user`, {
      email,
    });
  }

  async updateUser(id: string, data: Partial<User>) {
    return await this.patch(`${this.baseUrl}/user/${id}`, {
      ...data,
    });
  }
}

export const adminApi = new AdminApi();
export default adminApi;
