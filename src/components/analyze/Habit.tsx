import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HabitChart } from '../charts/stuAnalyze/HabitChart';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
import { useRouter } from 'vue-router';
export const Habit = defineComponent({
  setup: (props, context) => {
    const router = useRouter()
    const goodData = ref<{ name: string, value: number[] }[]>([])
    const typeArr = ref<string[]>(['png', 'docx', 'jpeg', 'pdf'])
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
        goodData.value = [
          { name: '曹珂俭', value: [0.42, 0.3, 0.14, 0.24] },
          { name: '黄梦瑶', value: [0.34, 0.24, 0.12, 0.3] },
          { name: '蔡奇奇', value: [0.24, 0.14, 0.32, 0.4] },
          { name: '李梓良', value: [0.14, 0.54, 0.12, 0.3] },
          { name: '捏于波', value: [0.44, 0.04, 0.22, 0.2] },
          { name: '张博涵', value: [0.31, 0.14, 0.12, 0.3] },
          { name: '王硕', value: [0.24, 0.44, 0.02, 0.1] },
        ]
        typeArr.value = ['png', 'docx', 'jpeg', 'pdf']
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
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='聚类分析全班提交习惯' />
        <HabitChart goodData={goodData.value} typeArr={typeArr.value} />
      </div>
    )
  }
})