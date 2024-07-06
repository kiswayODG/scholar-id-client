import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { EtudiantInterface } from "../model/EtudiantInterface";

export interface GestionEffectifApiInterface {
    fetchAllEtudiant : ()=>Promise<ApiResponseInterface<EtudiantInterface[]>>
    fetchnouveauMatricule : ()=>Promise<ApiResponseInterface<number>>
    createOrUpdateStudent : (etudiant: EtudiantInterface)=>Promise<ApiResponseInterface<Boolean>>;
    deleteEtudiant : (etudiant: EtudiantInterface)=>Promise<ApiResponseInterface<Boolean>>;

    printUniqueCard : (id: number) => Promise<any>;
    printCardMulti : (students:EtudiantInterface []) => Promise<any>;


}