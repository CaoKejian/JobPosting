import { PropType, defineComponent, onMounted, reactive, ref, toRefs, watch } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HistoryBit } from '../charts/teaAnalyze/HistoryBit';
import { HistorySubject } from '../charts/teaAnalyze/HistorySubject';
import { FormItem } from '../../shared/Form';
import { HistoryQuency } from '../charts/teaAnalyze/HistoryQuency';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
import { useInfoStore } from '../../store/useInfoStore';
import { useRouter } from 'vue-router';
import { MockHistoryClass, MockHistoryQuency, MockHistorySelf, MockHistorySubject } from '../../config/mock';

interface UseDataType {
  quency: { value: number, name: string }[]
  historySubject: { name: string, bit: number }[]
  historyClass: { bit: number, id: string }[]
  historySelf: {name: string, lateCounts: number, notlateCounts: number, bit: number}[]
}
export const History = defineComponent({

  setup: (props, context) => {
    const infostore = useInfoStore()
    const router = useRouter()
    const selectData = ref([
      { value: '班级', text: '按班级' },
      { value: '学科', text: '按学科' },
    ])
    const selectStudentData = ref([
      { value: '曹珂俭', text: '曹珂俭' },
      { value: '黄梦瑶', text: '黄梦瑶' },
    ])
    const selectValue = ref(selectData.value[1].text)
    const selectStudentValue = ref(selectStudentData.value[0].text)
    const useData = reactive<UseDataType>({
      quency: [],
      historySubject: [],
      historyClass: [],
      historySelf: []
    })
    const { quency, historySubject, historyClass, historySelf } = toRefs(useData)
    const fetchQuency = async (stuId: string) => {
      try {
        const res = await http.get<{ is_late: number, time: string }[]>('/analyze/history/tendency', { stuId })
        const x = res.data.map(item => ({
          name: item.time.slice(-5),
          value: item.is_late
        }))
        quency.value = x
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        quency.value = MockHistoryQuency
      }
    }
    const fetchClass = async (classId: string) => {
      try {
        const res = await http.get<any[]>('/analyze/history/subject', { classId })
        historySubject.value = res.data[0].subject
        historyClass.value = res.data[1].class
      } catch (err) {
        Toast({ message: '网络异常，此为Mock环境！' })
        historySubject.value = MockHistorySubject
        historyClass.value = MockHistoryClass
      }
    }
    const fetchSelf = async (classId: string) => {
      try{
        const res = await http.get<any[]>('/analyze/history', { classId })
        const x = res.data
        x[0].lateCounts.map((item: any, index: number) => {
          const obj: any = {}
          obj.name = item.name
          obj.lateCounts = item.value
          obj.notlateCounts = x[1].notlateCounts[index].value
          obj.bit = (item.value + x[1].notlateCounts[index].value) * x[2].totallateBit
          historySelf.value.push(obj)
        })
      }catch(err){
        historySelf.value = MockHistorySelf
      }
    }
    watch(() => selectStudentValue.value, async (n) => {
      fetchQuency(await infostore.nameMapFunction(n))
    }, { immediate: true })
    onMounted(() => {
      const classId = JSON.parse(localStorage.getItem('classID') as string)
      if (!classId) {
        Toast({ message: '班级码错误！' })
        return router.push('/teacher/publish')
      }
      fetchClass(classId)
      fetchSelf(classId)
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='个人提交历史监控(分组聚合)' />
        <HistoryBit historySelf={historySelf.value}/>

        <Quote name='班级/学科提交历史监控(聚类分析)' />
        <FormItem label='' type='select'
          v-model={selectValue.value}
          options={selectData.value}
        ></FormItem>
        <HistorySubject selectValue={selectValue.value} historyClass={historyClass.value} historySubject={historySubject.value} />

        <Quote name='逾期次数趋势追踪（时间序列分析）' />
        <FormItem label='' type='select'
          v-model={selectStudentValue.value}
          options={selectStudentData.value}
        ></FormItem>
        <HistoryQuency quency={quency.value} />
      </div>
    )
  }
})