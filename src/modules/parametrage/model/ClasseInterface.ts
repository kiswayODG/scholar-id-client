import { NiveauEtudeInterface } from "./NiveauInterface";

export interface ClasseInterface {
    id : number,
    libelleClasse : String,
    codeClasse : string,
    niveauEtude : NiveauEtudeInterface
}