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
}

export const adminApi = new AdminApi();
export default adminApi;
