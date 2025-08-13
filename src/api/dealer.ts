import { BidStatus } from "@/types/service";
import BaseApi from "./baseapi";

class DealerApi extends BaseApi {
  baseUrl: string = "dealer";
  constructor() {
    super();
  }

  async dealerDashboard() {
    return await this.get(`${this.baseUrl}/dashboard`);
  }

  async submitBid(
    serviceRequestId: string,
    estimatedPrice: number,
    turnAroundTime: number,
    deliveryMethod: string,
    notes: string,
    status: string
  ) {
    const data = await this.post(`${this.baseUrl}/bid`, {
      serviceRequestId,
      estimatedPrice,
      turnAroundTime,
      deliveryMethod,
      notes,
      status,
    });
    return data;
  }

  async serviceRequest(page: number = 1, limit: number = 10) {
    return await this.get(
      `${this.baseUrl}/service-request?page=${page}&limit=${limit}`
    );
  }

  async serviceRequestBidding(page: number = 1, limit: number = 10) {
    return await this.get(
      `${this.baseUrl}/service-request/biddings?page=${page}&limit=${limit}`
    );
  }

  async biddingStatusUpdate(id: string, status: BidStatus) {
    return await this.patch(`${this.baseUrl}/bidding/${id}`, {
      status,
    });
  }
}

export const dealerApi = new DealerApi();
export default dealerApi;
