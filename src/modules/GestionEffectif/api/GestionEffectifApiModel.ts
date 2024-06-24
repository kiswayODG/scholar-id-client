import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { EtudiantInterface } from "../model/EtudiantInterface";
import { GestionEffectifApiInterface } from "./GestionEffectifApiInterface";
import { HttpRequestParamsInterface } from "../../../appConfigs/httpClient/models/HttpRequestParamsInterface";
import { HttpRequestType } from "appConfigs/httpClient/models/HttpRequestType";
import { getHttpClient } from "appConfigs/httpClient/HttpClientIndex";import { GestionEffectifEndpoints } from "./GestionEffectifEndPoints";
import { Constante } from "@utils/Constantes";

export class GestionEffectifApiModel implements GestionEffectifApiInterface {

    public token = window.localStorage.getItem(Constante.TOKEN)

    fetchAllEtudiant() : Promise<ApiResponseInterface<EtudiantInterface[]>>{
        
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionEffectifEndpoints.fetchAllEtudiant,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }
        return getHttpClient().request<ApiResponseInterface<EtudiantInterface[]>>(requestParameters);
    }

}
 