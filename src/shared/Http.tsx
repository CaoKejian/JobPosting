import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Toast } from "vant";
import { JSONValue } from "../vite-env";

type GetConfig = Omit<AxiosRequestConfig, 'params' | 'url' | 'method'>
type PostConfig = Omit<AxiosRequestConfig, 'url' | 'data' | 'method'>
type PatchConfig = Omit<AxiosRequestConfig, 'url' | 'data'>
type DeleteConfig = Omit<AxiosRequestConfig, 'params'>


export class Http {
  instance: AxiosInstance
  constructor(baseURL: string) {
    this.instance = axios.create({
      baseURL
    })
  }
  get<R = unknown>(url: string, query?: Record<string, JSONValue>, config?: GetConfig) {
    return this.instance.request<R>({
      ...config,
      url,
      params: query,
      method: 'get'
    })
  }
  post<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PostConfig) {
    return this.instance.request<R>({
      ...config,
      url: url,
      data,
      method: 'post'
    })
  }
  // update
  patch<R = unknown>(url: string, data?: Record<string, JSONValue>, config?: PatchConfig) {
    return this.instance.request<R>({ ...config, url, data, method: 'patch' })
  }
  // destroy
  delete<R = unknown>(url: string, query?: Record<string, string>, config?: DeleteConfig) {
    return this.instance.request<R>({ ...config, url: url, params: query, method: 'delete' })
  }
}
function isDev() {
  if (location.hostname !== 'localhost'
    && location.hostname !== '127.0.0.1'
    && location.hostname !== '192.168.3.126') { return false }
  return true
}
export const http = new Http(isDev() ? '/api' : 'http://43.139.142.203:3000/api')
/* 未发布时暂时手动切换 */
// export const http = new Http(isDev() ? 'http://43.139.142.203:3000/api' : '/api')

http.instance.interceptors.request.use(config => {
    const jwt = localStorage.getItem('jwt')
    if (jwt) {
      config.headers!.Authorization = `Bearer ${jwt}`
    }
    if (config._autoLoading === true) {
      Toast.loading({
        message: '加载中...',
        forbidClick: true,
      });
    }
    return config
  })
http.instance.interceptors.response.use((response) => {
  const jwt = (response.headers.authorization as string)?.split(' ')[1]
  jwt && localStorage.setItem('jwt', jwt)
  if (response.config._autoLoading === true) {
    Toast.clear();
  }
  return response
}, (error: AxiosError) => {
  if (error.response?.config._autoLoading === true) {
    Toast.clear();
  }
  throw error
})

http.instance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 429) {
        alert('你太频繁了')
      }
    }
    throw error
  }
)