import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HistoryBit } from '../charts/teaAnalyze/HistoryBit';
export const History = defineComponent({
  
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Quote name='学生逾期与否占比(聚类分析)'/>
        <HistoryBit />
      </div>
    )
  }
})