import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { DifficultyQuency } from '../charts/teaAnalyze/DifficultyQuenvy';
export const Difficulty = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Quote name='学科平均分与难度估测'/>
        <DifficultyQuency />
      </div>
    )
  }
})