import { ClasseInterface } from "@modules/parametrage/model/ClasseInterface";
import { EtablissementInterface } from "@modules/parametrage/model/EtablissementInterface";
import { PerosnneInterface } from "commonDomain/PerosnneInterface";

export interface EtudiantInterface extends PerosnneInterface{
    matricule : String,
    parent? : PerosnneInterface,
    parentbis? : PerosnneInterface,
    etablissement : EtablissementInterface,
    classe : ClasseInterface
}