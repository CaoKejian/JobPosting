import { PropType, defineComponent, onMounted, reactive, toRefs } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { useInfoStore } from '../../store/useInfoStore';
import { ForeCastBall } from '../charts/teaAnalyze/ForeCastBall';
import { ForeModal } from '../charts/teaAnalyze/ForeModal';
import { http } from '../../shared/Http';
export interface UseDataType {
  selectData: { value: string, text: string }[],
  selectValue: string,
  refresh: number
}
export const ForeeCast = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const useData = reactive<UseDataType>({
      selectData: [],
      selectValue: '',
      refresh: 0
    })
    const { selectData, selectValue, refresh } = toRefs(useData)
    const handleStudentInfo = async () => {
      const info = infoStore.student
      for (const item of Object.entries(info)) {
        const obj = { value: '', text: '' }
        obj.value = item[0]
        obj.text = item[1]
        selectData?.value?.push(obj)
      }
      selectValue.value = (selectData?.value[0]?.text || '');
    }
    const reFresh = (value: string) => {
      if (value === 'refresh') {
        refresh.value++
      }
    }
    onMounted(() => {
      handleStudentInfo()
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='预测提交作业比率和预测得分' />
        <ForeCastBall selectData={selectData.value} onUpdate: refresh={reFresh} />

        <Quote name='学生行为特征分析和预测引擎（计算准确率、召回率、F1分数）' />
        <p style={{ marginTop: '0.5rem' }}>注：特征分析及训练模型</p>
        <ForeModal refresh={refresh.value} />
      </div>
    )
  }
})