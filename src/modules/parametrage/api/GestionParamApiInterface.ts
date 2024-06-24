import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { VilleInterface } from "../model/VilleInterface";
import { ClasseInterface } from "../model/ClasseInterface";
import { NiveauEtudeInterface } from "../model/NiveauInterface";
import { EtablissementInterface } from "../model/EtablissementInterface";
import { ParametreGlobalInterface } from "../model/ParametreGlobalInterface";

export interface GestionParamApiInterface {
    fetchAllVille : ()=>Promise<ApiResponseInterface<VilleInterface[]>>
    fetchClasses : ()=>Promise<ApiResponseInterface<ClasseInterface[]>>
    fetchNiveaux : ()=>Promise<ApiResponseInterface<NiveauEtudeInterface[]>>
    fetchActiveEtablissement : ()=>Promise<ApiResponseInterface<EtablissementInterface>>
    fetchParamByCode : (code:string)=>Promise<ApiResponseInterface<ParametreGlobalInterface[]>>

    createUpdateEtab : (etab : EtablissementInterface)=>Promise<ApiResponseInterface<Boolean>>
    createUpdateClasse : (classe : ClasseInterface)=>Promise<ApiResponseInterface<Boolean>>
    createUpdateParam : (cycle : ParametreGlobalInterface)=>Promise<ApiResponseInterface<Boolean>>
    createUpdateNiveau : (niveau : NiveauEtudeInterface)=>Promise<ApiResponseInterface<Boolean>>
    deleteClasse : (idClasse : number)=>Promise<ApiResponseInterface<Boolean>> 
    deleteUpdateNiveau : (idNiveau : number)=>Promise<ApiResponseInterface<Boolean>>
}