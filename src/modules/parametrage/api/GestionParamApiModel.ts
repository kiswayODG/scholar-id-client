import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { GestionParamApiInterface } from "./GestionParamApiInterface";
import { HttpRequestParamsInterface } from "../../../appConfigs/httpClient/models/HttpRequestParamsInterface";
import { HttpRequestType } from "appConfigs/httpClient/models/HttpRequestType";
import { getHttpClient } from "appConfigs/httpClient/HttpClientIndex";
import { GestionParamEndpoints } from "./GestionParamEndPoints";
import { VilleInterface } from "../model/VilleInterface";
import { Constante, ConstanteParamGlob } from "@utils/Constantes";
import { ClasseInterface } from "../model/ClasseInterface";
import { NiveauEtudeInterface } from "../model/NiveauInterface";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";

export class GestionParamApiModel implements GestionParamApiInterface {


    public token = window.localStorage.getItem(Constante.TOKEN)

    fetchActiveEtablissement(): Promise<ApiResponseInterface<EtablissementInterface>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionParamEndpoints.fetchActiveEtablissement,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }

        return getHttpClient().request<ApiResponseInterface<EtablissementInterface>>(requestParameters);
    }

    fetchAllVille(): Promise<ApiResponseInterface<VilleInterface[]>> {

        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionParamEndpoints.fetchAllVille,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }

        return getHttpClient().request<ApiResponseInterface<VilleInterface[]>>(requestParameters);
    }

    fetchClasses(): Promise<ApiResponseInterface<ClasseInterface[]>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionParamEndpoints.fetchClasses,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }

        return getHttpClient().request<ApiResponseInterface<ClasseInterface[]>>(requestParameters);
    }

    fetchNiveaux(): Promise<ApiResponseInterface<NiveauEtudeInterface[]>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionParamEndpoints.fetchNiveaux,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }

        return getHttpClient().request<ApiResponseInterface<NiveauEtudeInterface[]>>(requestParameters);
    }

    fetchParamByCode(): Promise<ApiResponseInterface<ParametreGlobalInterface[]>> {

        let request = `?code=${ConstanteParamGlob.PARAMG_CYCLE_ETUDE}`
        const requestParameters: HttpRequestParamsInterface = {
            requestType:HttpRequestType.get,
            endpoint:  `${GestionParamEndpoints.fetchParamByCode}${request}`,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            }
        }

        return getHttpClient().request<ApiResponseInterface<ParametreGlobalInterface[]>>(requestParameters);
    }

    createUpdateClasse(classe: ClasseInterface): Promise<ApiResponseInterface<Boolean>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.post,
            endpoint: GestionParamEndpoints.createUpdateClasse,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
            payload: classe,
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }

    createUpdateParam(paramGlob: ParametreGlobalInterface): Promise<ApiResponseInterface<Boolean>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.post,
            endpoint: GestionParamEndpoints.createUpdateParam,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
            payload: paramGlob,
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }

    createUpdateNiveau(niveau: NiveauEtudeInterface): Promise<ApiResponseInterface<Boolean>> {
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.post,
            endpoint: GestionParamEndpoints.createUpdateNiveau,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
            payload: niveau,
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }


    deleteClasse(idClasse: number): Promise<ApiResponseInterface<Boolean>> {

        let param = `?id=${idClasse}`
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: `${GestionParamEndpoints.deleteClasse}${param}`,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }

    deleteUpdateNiveau(idNiveau: number): Promise<ApiResponseInterface<Boolean>> {

        let param = `?id=${idNiveau}`
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.get,
            endpoint: GestionParamEndpoints.deleteUpdateNiveau,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }

    createUpdateEtab(etab: EtablissementInterface): Promise<ApiResponseInterface<Boolean>> {
        console.log("ici")
        const requestParameters: HttpRequestParamsInterface = {
            requestType: HttpRequestType.post,
            endpoint: GestionParamEndpoints.createEtab,
            requiresToken: true,
            headers: {
                Authorization: this.token || ""
            },
            payload: etab,
        }

        return getHttpClient().request<ApiResponseInterface<Boolean>>(requestParameters);
    }


}
