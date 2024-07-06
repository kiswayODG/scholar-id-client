import { NiveauEtudeInterface } from "./NiveauInterface";

export interface ClasseInterface {
    id : number,
    libelleClasse : string,
    codeClasse : string,
    niveauEtude : NiveauEtudeInterface
}