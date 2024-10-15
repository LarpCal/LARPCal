import axios, {AxiosError} from "axios";
import { jwtDecode } from "jwt-decode";
import { UserLoginData, UserForCreate, User, Larp, LarpForCreate, LarpAsJSON, LarpForUpdate, OrganizationForCreate, Organization, OrganizationForUpdate, PublicUser } from "../types";
import { JsonToLarp } from "./typeConverters";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001/";

type APIError = {
  message: string | string[];
}

class LarpAPI {

  //This token will be changed dynamically on login
  static token = "";

  static async request(
    endpoint: string,
    data = {},
    method = "get",
  ) {
    console.debug("API Call:", endpoint, data, method);

    const url = `${BASE_URL}${endpoint}`;
    const headers = { Authorization: `Bearer ${LarpAPI.token}` };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      const error = err as AxiosError<{error:APIError}>;
      const message = error.response!.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  static async multipartRequest(
    endpoint: string,
    data: FormData,
    method = "put",
  ) {

    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      "Content-Type": "multipart/form-data",
      "Authorization": `Bearer ${LarpAPI.token}`
    };
    const params = (method === "get")
      ? data
      : {};

    try {
      return (await axios({ url, method, data, params, headers })).data;
    } catch (err) {
      const error = err as AxiosError<{error:APIError}>;
      const message = error.response!.data.error.message;
      throw Array.isArray(message) ? message : [message];
    }
  }

  /************************ USERS ********************************/

  /** AUTH */

  /** Register and sign-in a new user*/
  static async userSignup(data: UserForCreate) {
    const response = await this.request('auth/register', data, 'post');
    LarpAPI.token = response.token;
    return response.token;
  }

  /** Log in a user*/
  static async userLogin(data: UserLoginData) {
    const response = await this.request('auth/token', data, 'post');
    LarpAPI.token = response.token;
    return response.token;
  }

  /** Log out current user*/
  static async userLogout() {
    LarpAPI.token = "";
  }

  /** Get the username from decoded token. Sets token and returns username.
   * token is a jwt with a username key.
  */

  static getUsernameFromToken(token: string) {
    const { username } = jwtDecode<{
      username:string,
      isAdmin:boolean,
      isOrganizer:boolean
    }>(token);
    LarpAPI.token = token;
    return username;
  }

  /** GET */

  //get full user data
  static async getUser(username: string) {
    const response = await this.request(`users/${username}`);
    return response.user;
  }

  //get all users
  static async getAllUsers():Promise<PublicUser[]>{
    const response = await this.request('users/')
    return response.users;
  }

  //verify that the user exists
  // static async verifyUser(username: string) {
  //   const response = await this.request(`users/${username}/verify`);
  //   return response.isUser;
  // }

  /** UPDATE */

  static async updateUser(data: User, username: string) {
    const responseData = await this.request(`users/${username}`, data, 'patch');
    return responseData.user;
  }


   /**  DELETE  */
   static async DeleteUser(username: string): Promise<User> {
    const response = await this.request(
      `users/${username}`,
      undefined,
      'delete'
    );
    return response.deleted;
  }


  /************************ LARPS ********************************/
  /**  CREATE  */

  static async createLarp(larp: LarpForCreate): Promise<Larp> {

    const response = await this.request('events', larp, 'post');
    return JsonToLarp(response.larp);
  }


  /**  READ  */
  static async getLarpById(id: number): Promise<Larp> {
    const response = await this.request(`events/${id}`);
    return JsonToLarp(response.larp);
  }


  static async getAllLarps(query: string | null): Promise<Larp[]> {

    const response = query
      ? await this.request(`events?q=${query}`)
      : await this.request(`events`);
    return response.larps.map((larp:LarpAsJSON)=>JsonToLarp(larp));
  }

  /**  UPDATE  */
  static async UpdateLarp(formData: LarpForUpdate): Promise<Larp> {
    const response = await this.request(
      `events/${formData.id}`,
      formData,
      'put'
    );
    return JsonToLarp(response.larp);
  }

  static async updateLarpImage(image: Blob, larpId: number) {
    const formData = new FormData();
    formData.set('image', image);

    const response = await this.multipartRequest(
      `events/${larpId}/image`,
      formData,
      'put'
    );
    return response.imageUrl;
  }

  /**  DELETE  */
  static async DeleteLarp(id: number): Promise<Larp> {
    const response = await this.request(
      `events/${id}`,
      undefined,
      'delete'
    );
    return response.larp;
  }

  /************************ ORGANIZATION ********************************/


  /**  CREATE  */
  static async CreateOrganization(orgData:OrganizationForCreate){
    const response = await this.request('orgs', orgData, 'post');
    return response.org;
  }

  /**  READ  */
  static async getOrgById(id: number): Promise<Organization> {
    const response = await this.request(`orgs/${id}`);
    return response.org;
  }

  static async getAllOrgs(): Promise<Organization[]> {
    const response = await this.request(`orgs`);
    return response.orgs;
  }

  /**  UPDATE  */
  static async UpdateOrg(formData: OrganizationForUpdate): Promise<Organization> {
    const response = await this.request(
      `orgs/${formData.id}`,
      formData,
      'patch'
    );
    return response.org;
  }

  static async updateOrgImage(image: Blob, orgId: number) {
    const formData = new FormData();
    formData.set('image', image);

    const response = await this.multipartRequest(
      `orgs/${orgId}/image`,
      formData,
      'put'
    );
    return response.imageUrl;
  }

  static async UpdateOrgApproval(id:number, isApproved:boolean):Promise<Organization> {
    const response = await this.request(
      `orgs/${id}/approval`,
      {id, isApproved},
      'patch'
    )
    return response.org;
  }

   /**  DELETE  */
   static async DeleteOrg(id: number): Promise<Organization> {
    const response = await this.request(
      `orgs/${id}`,
      undefined,
      'delete'
    );
    return response.deleted;
  }



  /************************ FAVORITES ********************************/
  //NOTE: These methods are not yet converted from a different project

  // static async getCookbook(username: string) {
  //   const response = await this.request(
  //     `users/${username}/cookbook`
  //   );
  //   return response.cookbook;
  // }


  // static async addToCookbook(larpId: number, username: string) {
  //   const response = await this.request(
  //     `events/${larpId}/addToCookbook`,
  //     { larpId, username },
  //     'post'
  //   );
  //   if (response.statusCode === 201) { return true; }
  //   return false; //is this what we want to return here?
  // }

  // static async removeFromCookbook(larpId: number, username: string) {
  //   const response = await this.request(
  //     `events/${larpId}/removeFromCookbook`,
  //     { larpId, username },
  //     'post'
  //   );
  //   if (response.statusCode === 200) { return true; }
  //   return false;
  // }

  /************************ BUG REPORTS ********************************/

  // static async createBugReport(reportedBy: string, reportText: string) {
  //   const response = await this.request(
  //     `bugReports`,
  //     { bugReport: { reportedBy, reportText } },
  //     'post'
  //   );
  //   return response.bugReport;
  // }


}

export default LarpAPI;