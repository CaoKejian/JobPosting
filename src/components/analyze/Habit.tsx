import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HabitChart } from '../charts/stuAnalyze/HabitChart';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
import { HabitPie } from '../charts/stuAnalyze/HabitPie';
import { MockGoodData, MockTypeArr } from '../../config/mock';
export const Habit = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const goodData = ref<{ name: string, value: number[] }[]>([])
    const typeArr = ref<string[]>(['png', 'docx', 'jpeg', 'pdf'])
    const pieData = ref<{ name: string, value: number }[]>([])
    const fetchHabit = async (classId: string) => {
      try {
        const res = await http.get<{ cluster_centers: number[][], file_types: string[], student_labels: {} }>('/analyze/habit', { classId }, { _autoLoading: true })
        const data = res.data
        if (res.data.file_types.length === 0) {
          return
        }
        let obj: { name: string, value: number[] } = { name: '', value: [] }
        for (const [name, index] of Object.entries(data.student_labels)) {
          obj = { name: '', value: [] }
          Object.assign(obj, { name, value: data.cluster_centers[index as number] })
          goodData.value.push(obj)
        }
        console.log(goodData.value)
        typeArr.value = data.file_types
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        goodData.value = MockGoodData
        typeArr.value = MockTypeArr
      }
    }
    const fetchPieData = async (classId: string) => {
      try {
        const res = await http.get<{ name: string, value: number }[]>('/analyze/typebit', { classId }, { _autoLoading: true })
        pieData.value = res.data
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        pieData.value = [{ name: 'jpeg', value: 0.24 }, { name: 'pdf', value: 0.12 }, { name: 'docx', value: 0.32 }, { name: 'png', value: 0.27 }]
      }
    }
    onMounted(() => {
      const classId = localStorage.getItem('classID') as string
      if (!classId) {
        Toast({ message: '班级码异常' })
        setTimeout(() => {
          router.push('/student/detail')
        }, 1000);
        return
      }
      fetchHabit(classId)
      fetchPieData(classId)
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='聚类分析全班提交习惯(K-means算法聚类分析)' />
        <HabitChart goodData={goodData.value} typeArr={typeArr.value} />
        <Quote name='全国类型占比指示图' />
        <HabitPie pieData={pieData.value} />
      </div>
    )
  }
})