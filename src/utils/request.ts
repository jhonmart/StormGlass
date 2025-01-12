import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

/* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
export interface RequestConfig extends AxiosRequestConfig {}
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export type Response<T = any> = AxiosResponse<T>;

export class Request {
  constructor(private request = axios) {}

  public get<T>(url: string, config: RequestConfig): Promise<Response<T>> {
    return this.request.get<T, Response<T>>(url, config);
  }

  public static isRequestError({ response }: AxiosError): boolean {
    return Boolean(response?.status);
  }
}
