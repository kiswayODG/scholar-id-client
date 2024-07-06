import { Ville } from "commonDomain/Ville";
import { VilleInterface } from "./VilleInterface";

export interface EtablissementInterface {
id : number,
nomEtablissement : String,
logoEtablissement : ArrayBuffer | File |null,
numeroTel : string,
numeroTelBis : string,
imageBase64?:string,
villeEtablissement : VilleInterface,
adresse : string;
anneeScolaire: string;
}