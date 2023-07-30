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
  classID: string
  page: number
}


type Resource<T> = {
  resource: T
}

interface Resource<T> {
  data: T[];
  // 可以在这里添加其他可能的属性
}


export type Root = Work[]

type Work ={
  _id: string
  stuId: number
  classId: number
  subject: string
  time: number
  branch: string
  file: File
  __v: number
}
export interface File {
  fileName: string
  fileUrl: string
}
