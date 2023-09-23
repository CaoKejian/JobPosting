import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { AnalyzeAverage } from '../charts/teaAnalyze/AnalyzeAverage';
export const HandAnalyze = defineComponent({

  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Quote name='学生平均分差异_K-means聚类算法' />
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>注：按时提交作业和迟交作业的学生的平均分数是否有显著差异</p>
        <AnalyzeAverage />
      </div>
    )
  }
})