import { defineStore } from "pinia";
import { http } from "../shared/Http";
import { User } from "../vite-env";

type InfoState = {
  student: Record<number, string>,
  teacher: Record<number, string>
}
type InfoActions = {
  fetchInfo: () => void
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
    }
  }
})