import { VilleInterface } from "@modules/parametrage/model/VilleInterface";
import { Sexe } from "./Sexe";

export interface PerosnneInterface { 
    id? : number,
    nom : string,
    prenom : String,
    sexe : Sexe,
    adresse? : string,
    telephone? : string,
    dateNaissance : Date | string,
    lieuNaiss : VilleInterface,
}
