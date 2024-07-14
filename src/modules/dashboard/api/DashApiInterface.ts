import { ApiResponseInterface } from "app-api/ApiResponseInterface";
import { StatsInterface } from "../model/StatInterface";


export interface DashApiInterface {
    getGenreStatCamembert : ()=>Promise<ApiResponseInterface<StatsInterface []>>
}