import BaseApi from "./baseapi";

class WaitingListApi extends BaseApi {
  baseUrl: string = "waiting-list";
  constructor() {
    super();
  }

  async createWaitingList(email: string) {
    const data = await this.post(`${this.baseUrl}`, {
      email,
    });
    return data;
  }

  async getWaitingList(page = 1, limit = 10) {
    const data = await this.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
    return data;
  }

  async deleteWaitingList(id: string) {
    const data = await this.delete(`${this.baseUrl}/${id}`);
    return data;
  }
}

export const waitingListApi = new WaitingListApi();
export default waitingListApi;
