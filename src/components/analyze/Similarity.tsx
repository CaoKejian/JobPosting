import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { http } from '../../shared/Http';
import { Quote } from '../../shared/Quote';
import { SimilarityChart } from '../charts/stuAnalyze/SimilarityChart';
import { SimilarityLei } from '../charts/stuAnalyze/SimilarityLei';
export const Similarity = defineComponent({
  setup: (props, context) => {
    const fetchSimilary = async (name: string) => {
      const res = await http.get('/analyze/subjectscores', { name }, { _autoLoading: true })
    }
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      fetchSimilary(info.name)
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='学科之间的相关性(矩阵分析)'/>
        <SimilarityChart />
        <Quote name='学科之间的相关性(雷达图)'/>
        <SimilarityLei />
      </div>
    )
  }
})