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
}
export const useInfoStore = defineStore<string, InfoState, {}, InfoActions>('info', {
  state: () => ({
    student: {},
    teacher: {}
  }),
  actions: {
    async fetchInfo() {
      const classId = localStorage.getItem('classID')
      if (!classId) return
      const res = await http.get<User[]>('/class', { classId })
      res.data.map((item: User) => (
        this.student[item.stuId] = item.name
      ))
    },
    refresh() {
      if (Object.keys(this.student).length === 0) {
        this.fetchInfo()
      }
    },
    stuIdMapFunction(stuId: number) {
      if (Object.keys(this.student).length === 0) {
        return new Promise<string | undefined>((resolve, reject) => {
          http.get<User[]>('/class', { classId: 123123 }).then(res => {
            res.data.forEach((item: User) => (
              this.student[item.stuId] = item.name
            ));
            console.log("Student data is available now.");
            resolve(this.student[Number(stuId)] ? this.student[Number(stuId)] : '未录入'); 
          }).catch(error => {
            reject(error);
          });
        });
      } else {
        return Promise.resolve(this.student[Number(stuId)] ? this.student[Number(stuId)] : '未录入');
      }
    }
  }
})