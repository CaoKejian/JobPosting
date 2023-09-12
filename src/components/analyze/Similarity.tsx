import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import s from './WeekFrequency.module.scss';
import { http } from '../../shared/Http';
import { Quote } from '../../shared/Quote';
import { SimilarityChart } from '../charts/stuAnalyze/SimilarityChart';
import { SimilarityLei } from '../charts/stuAnalyze/SimilarityLei';
import { Form, FormItem } from '../../shared/Form';
type RadarData = {
  [key: string]: number;
};
export const Similarity = defineComponent({
  setup: (props, context) => {
    const selectValue = ref<string>('')
    const selectOptions = ref<{ value: string, text: string }[]>([])
    const slelectData = ref<{ name: string, value: number, max: number }[]>([])
    let staticData = {}
    const fetchSimilary = async (name: string) => {
      const res = await http.get<any>('/analyze/subjectscores', { name }, { _autoLoading: true })
      const data = res.data
      staticData = data
      for (const [subject, value] of Object.entries(staticData)) {
        handleSubject(subject)
      }
      handleData(selectOptions.value[0].text)
    }
    const handleData = (name: string) => {
      for (const [subject, value] of Object.entries(staticData)) {
        if (subject === name) {
          handleSelectData(value as RadarData)
        }
      }
    }
    const handleSelectData = (subjectMap: RadarData) => {
      slelectData.value = []
      const max = 100
      for (const [name, value] of Object.entries(subjectMap)) {
        slelectData.value.push({ name, value, max })
      }
    }
    const handleSubject = (subject: string) => {
      selectOptions.value.push({ value: subject, text: subject })
      selectValue.value = selectOptions.value[0].text
    }
    watch(() => selectValue.value, (newValue: string) => {
      handleData(newValue)
    })
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      fetchSimilary(info.name)
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='学科之间的相关性(矩阵分析)' />
        <SimilarityChart />
        <Quote name='学科之间的相关性(雷达图)' />
        <Form>
          <FormItem label='' type='select'
            v-model={selectValue.value}
            options={selectOptions.value}
          ></FormItem>
        </Form>
        <SimilarityLei slelectData={slelectData.value} selectValue={selectValue.value} />
      </div>
    )
  }
})