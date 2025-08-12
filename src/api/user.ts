import BaseApi from "./baseapi";

class UserApi extends BaseApi {
  baseUrl: string = "user";
  constructor() {
    super();
  }

  async userUpdate(
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    // accountType: string,
    phoneNo: string,
    status: string,
    companyName: string,
    bio: string,
    address: string,
    profilePicture?: string
  ) {
    const data = await this.patch(`${this.baseUrl}/${id}`, {
      firstName,
      lastName,
      email,
      //   accountType,
      status,
      phoneNo,
      companyName,
      bio,
      address,
      ...(profilePicture && { profilePicture }),
    });
    return data;
  }
}

export const userApi = new UserApi();
export default userApi;
