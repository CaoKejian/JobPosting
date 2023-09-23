import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { DifficultyQuency } from '../charts/teaAnalyze/DifficultyQuenvy';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
export const Difficulty = defineComponent({
  setup: (props, context) => {
    const average = ref<number[]>([])
    const subject = ref<string[]>([])
    const x = ref<{}[]>([])
    const fetchData = async (classId: string) => {
      try {
        const res = await http.get<{ average_score: number, subject: string }[]>('/analyze/difficulty', { classId })
        const data = res.data
        x.value = data
        data.map(item => {
          average.value.push(item.average_score)
          subject.value.push(item.subject)
        })
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
      }
    }
    onMounted(() => {
      fetchData('123123')
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='学科平均分与难度估测' />
        {
          x.value.length !== 0 ?
            <DifficultyQuency x={x.value} average={average.value} subject={subject.value} />
            : null
        }
      </div>
    )
  }
})