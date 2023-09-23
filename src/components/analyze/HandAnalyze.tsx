import { PropType, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { AnalyzeAverage } from '../charts/teaAnalyze/AnalyzeAverage';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
import { MockAnalyzeAverage } from '../../config/mock';
import { AnalyzeTime } from '../charts/teaAnalyze/AnalyzeTime';
import { useRouter } from 'vue-router';

export interface Root {
  maxtime: number
  result: Result[]
}
export interface Result {
  data: Daum[]
  name: string
}
export interface Daum {
  allSubmit: number
  score: number
  time: string
}

interface UseDataType {
  average: { intime: number, overtime: number },
  timeAndScore: Root
}
export const HandAnalyze = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const useData = reactive<UseDataType>({
      average: { intime: 0, overtime: 0 },
      timeAndScore: { maxtime: 0, result: [] }
    })
    const { average, timeAndScore } = toRefs(useData)
    const fetchAverage = async (classId: string) => {
      try {
        const res = await http.get<{ intime: number, overtime: number }>('/analyze/regression', { classId })
        average.value = res.data
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        average.value = MockAnalyzeAverage
      }
    }
    const fetchTime = async (classId: string) => {
      try {
        const res = await http.get<Root>('/analyze/submission', { classId })
        timeAndScore.value = res.data
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        // timeAndScore.value = MockAnalyzeAverage
      }
    }
    onMounted(() => {
      const classId = localStorage.getItem('classID') as string
      if (!classId) {
        Toast({ message: '班级码错误！' })
        return router.push('/teacher/publish')
      }
      fetchAverage(classId)
      fetchTime(classId)
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='学生平均分差异_K-means聚类算法' />
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>注：按时提交作业和迟交作业的学生的平均分数是否有显著差异</p>
        <AnalyzeAverage average={average.value} />

        <Quote name='时间段提交与分数的分析预测' />
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>注：完成作业分数与提交时间之间的关系</p>
        <AnalyzeTime timeAndScore={timeAndScore.value}/>
      </div>
    )
  }
})