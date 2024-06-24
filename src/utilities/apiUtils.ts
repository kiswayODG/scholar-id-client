
import axios, { AxiosResponse } from "axios";
import apiClient from "../appConfigs/apiClient"

interface ApiCallParams {
  url: string;
  method: string;
  data?: any;
  params?: any;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  config: any;
  request?: any;
}

export async function makeApiCall<T>(params: ApiCallParams): Promise<ApiResponse<T>> {
  const { url, method, data, params: queryParams } = params;
  try {
    const response: AxiosResponse<T> = await apiClient({
      url,
      method,
      data,
      params: queryParams,
    });
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      config: response.config,
      request: response.request,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      return Promise.reject({
        data: error.response.data,
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        config: error.config,
        request: error.request,
      });
    }
    return Promise.reject(error);
  }
}
