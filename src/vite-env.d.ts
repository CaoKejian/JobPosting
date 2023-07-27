/// <reference types="vite/client" />

import { AxiosRequestConfig } from 'axios'
declare module 'axios' {
  export interface AxiosRequestConfig {
    _autoLoading?: boolean
    _mock?: string
  }
}

type JSONValue = null | boolean | string | number | JSONValue[] | Record<string, JSONValue>
type FormErrors<T> = { [k in keyof typeof T]: string[] }


type Resources<T = any> = {
  resources: T[]
  pager: {
    page: number,
    per_page: number,
    count: number
  }
}


type Resource<T> = {
  resource: T
}