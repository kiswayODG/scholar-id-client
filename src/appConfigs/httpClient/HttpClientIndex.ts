import { HttpClientAxios } from "./models/HttpClientAxios";
import { HttpClientInterface } from "./models/HttpClientInterface";


let _httpClient: HttpClientInterface | undefined = undefined;

export const getHttpClient = () => {
    if(!_httpClient) {
            _httpClient = new HttpClientAxios();
        
    }
    return _httpClient as HttpClientInterface;
}