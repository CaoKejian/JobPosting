import { defineStore } from "pinia";
import { http } from "../shared/Http";
import { User } from "../vite-env";

type InfoState = {
  student: Record<number, string>,
  teacher: Record<number, string>
}
type InfoActions = {
  fetchInfo: () => Promise<void>
  refresh: () => void
  stuIdMapFunction: (stuId: number) => Promise<string | undefined>
  teacherMapFunction: (stuId: number) => Promise<string | undefined>
}
export const useInfoStore = defineStore<string, InfoState, {}, InfoActions>('info', {
  state: () => ({
    student: {},
    teacher: {}
  }),
  actions: {
    async fetchInfo() {
      const res = await http.get<User[]>('/class/all')
      res.data.map((item: User) => {
        if (item.classId) {
          this.student[item.stuId] = item.name;
        } else {
          this.teacher[item.stuId] = item.name;
        }
      });
    },
    refresh() {
      if (Object.keys(this.student).length === 0) {
        this.fetchInfo()
      }
    },
    async stuIdMapFunction(stuId: number) {
      if (Object.keys(this.student).length === 0) {
        await this.fetchInfo()
        return await Promise.resolve(this.student[Number(stuId)] ? this.student[Number(stuId)] : '未录入');
      } else {
        return Promise.resolve(this.student[Number(stuId)] ? this.student[Number(stuId)] : '未录入');
      }
    },
    async teacherMapFunction(stuId: number) {
      if (Object.keys(this.student).length === 0) {
        await this.fetchInfo()
        return await Promise.resolve(this.teacher[Number(stuId)] ? this.teacher[Number(stuId)] : '未录入');
      } else {
        return Promise.resolve(this.teacher[Number(stuId)] ? this.teacher[Number(stuId)] : '未录入');
      }
    }
  }
})