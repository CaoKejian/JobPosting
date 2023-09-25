import { PropType, defineComponent, onMounted, reactive, toRefs } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { useInfoStore } from '../../store/useInfoStore';
import { ForeCastBall } from '../charts/teaAnalyze/ForeCastBall';
export interface UseDataType {
  selectData: { value: string, text: string }[],
  selectValue: string,
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
    })
    const {  selectData, selectValue } = toRefs(useData)
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
    onMounted(() => {
      handleStudentInfo()
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='预测提交作业比率和预测得分' />
        <ForeCastBall selectData={selectData.value}/>
      </div>
    )
  }
})