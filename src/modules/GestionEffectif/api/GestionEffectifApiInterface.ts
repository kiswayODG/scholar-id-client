import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { EtudiantInterface } from "../model/EtudiantInterface";

export interface GestionEffectifApiInterface {
    fetchAllEtudiant : ()=>Promise<ApiResponseInterface<EtudiantInterface[]>>
}