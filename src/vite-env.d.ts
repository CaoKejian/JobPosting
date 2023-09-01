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
type User = {
  data: [],
  stuId: number
  email: string
  classId: number
  name: string
  isRoot: boolean
  isAuth: boolean
}

type pubWork = {
  user: string,
  classId: string
  subject: string,
  branch: string,
  time?: number,
  cutTime?: undefined | number,
  content: string
}

type Work = {
  data: [],
  _id: string
  name: string
  stuId: number
  classId: number
  subject: string
  time: number
  branch: string
  file: File
  favor: Boolean //优秀作品
  content: string // 作业描述，用于详细说明作业要求和内容。
  score: Number // 得分
  tComments: string // 教师评语
  isPass: Boolean// 已评
  user: string, // 发布者
  cutTime: number,
  __v: number
}
type WorkObj = {
  _id: string
  stuId: number
  classId: number
  name: string
  subject: string
  time: number
  branch: string
  file: File
  favor: Boolean //优秀作品
  content: String // 作业描述，用于详细说明作业要求和内容。
  score: Number // 得分
  tComments: String // 教师评语
  isPass: Boolean// 已评
  user: string, // 发布者
  cutTime: number,
  __v: number
}
type pubWork = {
  _id: string,
  subject: string,
  classId: number,
  user: string,
  __v: number
}
type Class = {
  data: [],
  classes: [],
  subjects: []
  branches: []
}
type FeedBackObj = {
  _id: string
  name: string
  email: string
  stuId: number
  feedBackValue: string
  randomMargin?: number
  randomSpeed?: number
}
interface ClassSelectItem {
  value: string;
  text: string;
}
export interface File {
  fileName: string
  fileUrl: string
}

