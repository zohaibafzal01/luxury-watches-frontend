import BaseApi from "./baseapi";

class AuthApi extends BaseApi {
  baseUrl: string = "auth";
  constructor() {
    super();
  }

  async adminLogin(email: string, password: string) {
    const data = await this.post(`${this.baseUrl}/admin/sign-in`, {
      email,
      password,
    });
    return data;
  }

  async consumerLogin(email: string, password: string) {
    const data = await this.post(`${this.baseUrl}/consumer/sign-in`, {
      email,
      password,
    });
    return data;
  }

  async dealerLogin(email: string, password: string) {
    const data = await this.post(`${this.baseUrl}/dealer/sign-in`, {
      email,
      password,
    });
    return data;
  }

  async register(
    firstName: string,
    lastName: string,
    email: string,
    accountType: string,
    phoneNo: string,
    password: string,
    status: string = "active"
  ) {
    const data = await this.post(`${this.baseUrl}/sign-up`, {
      firstName,
      lastName,
      email,
      accountType,
      phoneNo,
      password,
      status,
    });
    return data;
  }

  async forgotPassword(email: string) {
    return await this.post(`${this.baseUrl}/forgot_password`, { email });
  }

  async changePassword(oldPassword: string, newPassword: string) {
    return await this.put(`${this.baseUrl}/change_password`, {
      oldPassword,
      newPassword,
    });
  }
}

export const authApi = new AuthApi();
export default authApi;
