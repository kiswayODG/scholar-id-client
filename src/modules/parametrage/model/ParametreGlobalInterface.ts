import { EtablissementInterface } from "./EtablissementInterface";

export interface ParametreGlobalInterface {
    id: number;
    libelleParam: string;
    libelleCourt: string;
    codeParam: string;
    paramEtab: EtablissementInterface;
}