import { EtablissementInterface } from "./EtablissementInterface";
import { ParametreGlobalInterface } from "./ParametreGlobalInterface";

export interface NiveauEtudeInterface {
id : number,
libelleNiveauEtude : string,
libelleCourt : string,
codeNiveauEtude : String,
etablissement : EtablissementInterface,
cycleEtude : ParametreGlobalInterface,
}