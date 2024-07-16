import { PerosnneInterface } from "commonDomain/PerosnneInterface";
import { Sexe } from "commonDomain/Sexe";

export interface UserInterface {
    id? : number,
    password? : string,
    username : string,
    nom? : string,
    prenom? : String,
    sexe? : Sexe | string | null,
    adresse? : string,
    telephone? : string,
    dateNaissance? : Date | string,
    credit?: number;
}


export interface AuthenticationResponse {
    token : string,
    logged : boolean,
    user : UserInterface,
}