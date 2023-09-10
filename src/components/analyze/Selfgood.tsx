import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { Average } from '../charts/stuAnalyze/Average';
import { Good } from '../charts/stuAnalyze/Good';
import { http } from '../../shared/Http';
import { useInfoStore } from '../../store/useInfoStore';
export const Selfgood = defineComponent({
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const value = ref<number[]>([])
    const quency = ref<number[]>([])
    const subject = ref<string[]>([])
    const fetchAverage = async (name: string) => {
      const res = await http.get<{ average: number, subject: string }[]>('/analyze/average', { name })
      const data = res.data
      data.map(item => {
        value.value.push(item.average)
        subject.value.push(item.subject)
      })
      quency.value = [70, 75, 65, 60, 85]
      if (data.length === 0) {
        value.value = [83, 68, 73, 56, 90]
        quency.value = [70, 75, 65, 60, 85]
        subject.value = ['数据挖掘','Vue3','TypeScript','React','高数(1)']
      }
    }
    onMounted(async () => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      await fetchAverage(await infoStore.stuIdMapFunction(info.stuId))
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='平均分预览' />
        <Average value={value.value} quency={quency.value} subject={subject.value}/>
        <Quote name='个人擅长方向' />
        <Good />
      </div>
    )
  }
})