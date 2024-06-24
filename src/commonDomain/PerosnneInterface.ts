import { VilleInterface } from "@modules/parametrage/model/VilleInterface";
import { Sexe } from "./Sexe";

export interface PerosnneInterface { 
    id? : number,
    nom : String,
    prenom : String,
    sexe : Sexe,
    adresse? : String,
    telephone? : String,
    dateNaissance : Date | String,
    lieuNaiss : VilleInterface,
}
