export interface UserInterface {
    id? : number,
    password : string,
    username : string
}

export interface AuthenticationResponse {
    token : string,
    logged : boolean,
    user : UserInterface,
}