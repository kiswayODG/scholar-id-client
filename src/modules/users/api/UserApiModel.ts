import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { AuthenticationResponse, UserInterface } from "../model/UserInterface";
import { UsersApInterface } from "./UserApiInterface";
import { UsersEndpoints } from "./UserEndPoint";
import { HttpRequestParamsInterface } from "../../../appConfigs/httpClient/models/HttpRequestParamsInterface";
import { HttpRequestType } from "appConfigs/httpClient/models/HttpRequestType";
import { getHttpClient } from "appConfigs/httpClient/HttpClientIndex";

export class UsersApiModel implements UsersApInterface {
    
    
    public token = window.localStorage.getItem('accessToken')

    userLogin(userCredentials: UserInterface): Promise<ApiResponseInterface<AuthenticationResponse>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.post,
            endpoint: UsersEndpoints.login,
            requiresToken: false,
            payload:userCredentials,
           
        }
        return getHttpClient().request<ApiResponseInterface<AuthenticationResponse>>(requestParameters);
    }


    fetchUserList(): Promise<ApiResponseInterface<UserInterface>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: UsersEndpoints.fetchUsers,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }
        return getHttpClient().request<ApiResponseInterface<UserInterface>>(requestParameters);
    }

    fetchRoleList(): Promise<ApiResponseInterface<[]>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: UsersEndpoints.fetchRoles,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }
        return getHttpClient().request<ApiResponseInterface<[]>>(requestParameters);
    }
}