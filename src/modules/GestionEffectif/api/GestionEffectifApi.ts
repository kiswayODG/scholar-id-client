import { GestionEffectifApiInterface } from "./GestionEffectifApiInterface";
import { GestionEffectifApiModel } from "./GestionEffectifApiModel";

const GestionEffectifApiClient: GestionEffectifApiInterface = new GestionEffectifApiModel();

export {
    GestionEffectifApiClient
}