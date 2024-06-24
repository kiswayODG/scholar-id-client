import { HttpRequestType } from "./HttpRequestType"


export interface HttpRequestParamsInterface<P=void> {
    requestType: HttpRequestType
    endpoint: string
    requiresToken: boolean
    headers?: {[key: string]: string}
    payload?: P | any
    params?: {[p: string]: number | string |Date}
    mockDelay?: number,
    responseType?: string
}