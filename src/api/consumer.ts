import { BidStatus } from "@/types/service";
import BaseApi from "./baseapi";

class ConsumerApi extends BaseApi {
  baseUrl: string = "consumer";
  constructor() {
    super();
  }

  async serviceRequest(
    brand: string,
    model: string,
    issueDescription: string,
    deliveryPreference: string,
    payload?: any
  ) {
    const data = await this.post(
      `${this.baseUrl}/service-request`,
      payload || {
        brand,
        model,
        issueDescription,
        deliveryPreference,
      }
    );
    return data;
  }

  async getServiceRequest(page = 1, limit = 10, search = "", status = "all") {
    const query = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
    });

    if (search) {
      query.append("search", search);
    }

    if (status !== "all") {
      query.append("status", status);
    }

    return await this.get(
      `${this.baseUrl}/service-request?${query.toString()}`
    );
  }

  async consumerStatusUpdate(id: string, status: BidStatus) {
    return await this.patch(`${this.baseUrl}/service-request/${id}`, {
      status,
    });
  }
}

export const consumerApi = new ConsumerApi();
export default consumerApi;
