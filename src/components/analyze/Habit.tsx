import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HabitChart } from '../charts/stuAnalyze/HabitChart';
export const Habit = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Quote name='聚类分析全班提交习惯'/>
        <HabitChart />
      </div>
    )
  }
})