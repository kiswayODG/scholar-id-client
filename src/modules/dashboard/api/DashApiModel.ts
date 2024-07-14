import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { StatsInterface } from "../model/StatInterface";
import { DashApiInterface } from "./DashApiInterface";
import { HttpRequestParamsInterface } from "@appConfigs/httpClient/models/HttpRequestParamsInterface";
import { DashApiEndpoint } from "./DashApiEndpoint";
import { HttpRequestType } from "@appConfigs/httpClient/models/HttpRequestType";
import { Constante } from "@utils/Constantes";
import { getHttpClient } from "@appConfigs/httpClient/HttpClientIndex";


export class DashApiModel implements DashApiInterface {
    
    public token = window.localStorage.getItem(Constante.TOKEN)

    getGenreStatCamembert() : Promise<ApiResponseInterface<StatsInterface[]>>{
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: DashApiEndpoint.getGenreCamembertStat,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }
        return getHttpClient().request<ApiResponseInterface<StatsInterface[]>>(requestParameters);
   
    }
    
}
