import { GestionEffectifApiClient } from "@modules/GestionEffectif/api/GestionEffectifApi";
import { GestionEffectifApiInterface } from "@modules/GestionEffectif/api/GestionEffectifApiInterface";
import { GestionParamApiClient } from "@modules/parametrage/api/GestionParamApi";
import { GestionParamApiInterface } from "@modules/parametrage/api/GestionParamApiInterface";
import { usersApiClient } from "modules/users/api/UserApi";
import { UsersApInterface } from "modules/users/api/UserApiInterface";

interface ApiClientInterface {
    effectifs : GestionEffectifApiInterface,
    users: UsersApInterface,
    parametrage: GestionParamApiInterface,

}

const apiClient: ApiClientInterface = {
    effectifs : GestionEffectifApiClient,
    users: usersApiClient,
    parametrage : GestionParamApiClient

}

export {
    apiClient
}