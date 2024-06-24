import axios, { AxiosRequestConfig } from "axios";
import { HttpClientInterface } from "./HttpClientInterface";
import { HttpRequestParamsInterface } from "./HttpRequestParamsInterface";
import { UrlUtils } from "./UrlUtils";
import { HttpRequestType } from "./HttpRequestType";
import { redirectRootUrl, removeDataFromLocalStorage } from "../../../utilities/Utils"
import { Constante } from "@utils/Constantes";


export class HttpClientAxios implements HttpClientInterface {

    async request<R, P = void>(parameters: HttpRequestParamsInterface<P>): Promise<R> {
        const { requestType, endpoint
            , requiresToken, payload,
            headers, mockDelay, responseType } = parameters;
        const fullUrl = UrlUtils.getFullUrlWithParams(endpoint, payload as any);
        const options: AxiosRequestConfig = {
            headers: {},
            maxRedirects: 0,
        }
        options.headers = {
            'Content-Type': 'application/json'
        }
        if (headers) {

            if (requiresToken) {
                options.headers = {
                    'Authorization': `Bearer ${window.localStorage.getItem(Constante.TOKEN)}`
                }
            }
        }
        if (responseType && responseType === "arraybuffer") {
            options.responseType = responseType;
        }
        if(requiresToken && options.headers){
            options.withCredentials = true
        }
        let result!: R;

        try {
            switch (requestType) {
                case HttpRequestType.get: {
                    const response = await axios.get(fullUrl, options);
                    result = response?.data as R;
                    break;
                }
                case HttpRequestType.post: {
                    const response = await axios.post(fullUrl, payload, options);
                    result = response?.data as R;
                    break;
                }
                case HttpRequestType.put: {
                    const response = await axios.put(fullUrl, payload, options);
                    result = response?.data as R;
                    break;
                }
                case HttpRequestType.delete: {
                    const response = await axios.delete(fullUrl, options);
                    result = response?.data as R;
                    break;
                }
                case HttpRequestType.patch: {
                    const response = await axios.patch(fullUrl, payload, options);
                    result = response?.data as R;
                    break;
                }
                default: {
                    console.warn('HttpClientAxios: invalid requestType argument or request type not implemented')
                }
            }

        } catch (e) {
            let error: string = e + ""
            if (error.includes("403")) {
                removeDataFromLocalStorage()
                 redirectRootUrl()
            }
            console.error('HttpClientAxios: exception ', e)
            throw Error('HttpClientAxios: exception')
        }
        if ((mockDelay || 0) > 0) {
            return new Promise<R>(resolve => {
                setTimeout(() => {
                    resolve(result)
                }, mockDelay)
            })
        }
        return result;
    }
}