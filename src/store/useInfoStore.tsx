import { defineStore } from "pinia";
import { http } from "../shared/Http";
import { User } from "../vite-env";

type InfoState = {
  student: Record<number, string>,
  teacher: Record<number, string>,
  class: Record<number, string>,
  isRoot: number[]
}
type InfoActions = {
  fetchInfo: () => Promise<void>
  refresh: () => Promise<boolean | undefined>
  isRootFunction: (stuId: number) => Promise<boolean>
  stuIdMapFunction: (stuId: number) => Promise<string | undefined>
  teacherMapFunction: (stuId: number) => Promise<string | undefined>
  nameMapFunction: (name: string) => Promise<string>
  classMapFunction: (classId?: number) => Promise<string>
  classIdMapFunction: (className?: string) => Promise<string>
  isTeacher: (stuId: string) => Promise<boolean>
}
export const useInfoStore = defineStore<string, InfoState, {}, InfoActions>('info', {
  state: () => ({
    student: {},
    teacher: {},
    class: {
      123123: '大数据B201',
      122122: '智能B222'
    },
    isRoot: []
  }),
  actions: {
    async fetchInfo() {
      const res = await http.get<User[]>('/class/all')
      res.data.map((item: User) => {
        if(item.isRoot){
          this.isRoot.push(item.stuId)
        }
        if (item.classId) {
          this.student[item.stuId] = item.name;
        } else {
          this.teacher[item.stuId] = item.name;
        }
      });
    },
    async refresh() {
      if (Object.keys(this.student).length === 0) {
        await this.fetchInfo()
      }
      return Promise.resolve(true)
    },
    async isRootFunction(stuId: number){
      return this.refresh().then(res => {
        return Promise.resolve(this.isRoot.includes(stuId) ? true : false);
      })
    },
    async stuIdMapFunction(stuId: number) {
      return this.refresh().then(res => {
        return Promise.resolve(this.student[Number(stuId)] ? this.student[Number(stuId)] : '未录入');
      })
    },
    async teacherMapFunction(stuId: number) {
      return this.refresh().then(res => {
        return Promise.resolve(this.teacher[Number(stuId)] ? this.teacher[Number(stuId)] : '未录入');
      })
    },
    async nameMapFunction(name: string) {
      for (const [stuId, stuName] of Object.entries(this.student)) {
        if (stuName === name) {
          return Promise.resolve(String(stuId))
        }
      }
      return Promise.resolve('未录入')
    },
    async classMapFunction(classId?: number) {
      return this.refresh().then(res => {
        return Promise.resolve(this.class[Number(classId)] ? this.class[Number(classId)] : '未录入');
      })
    },
    async classIdMapFunction(className?: string) {
      for (const [classId, claName] of Object.entries(this.class)) {
        if (claName === className) {
          return Promise.resolve(String(classId))
        }
      }
      return Promise.resolve('未录入')
    },
    async isTeacher(stuId: string) {
      return this.refresh().then(res => {
        if (stuId in this.teacher) {
          return Promise.resolve(true)
        } else {
          return Promise.resolve(false)
        }
      })
    }
  }
})