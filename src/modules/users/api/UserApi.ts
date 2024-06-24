import { UsersApInterface } from "./UserApiInterface";
import { UsersApiModel } from "./UserApiModel";

const usersApiClient: UsersApInterface = new UsersApiModel();

export {
    usersApiClient
}