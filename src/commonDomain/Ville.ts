export interface Ville {
    id : number,
    nomVille : String
}

export const initVille = ():Ville =>({
    id:0,
    nomVille:"",
})