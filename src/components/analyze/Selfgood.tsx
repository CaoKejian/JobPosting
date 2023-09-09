import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { Average } from '../charts/stuAnalyze/Average';
import { Difference } from '../charts/stuAnalyze/Difference';
import { Good } from '../charts/stuAnalyze/Good';
export const Selfgood = defineComponent({
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <Quote name='平均分预览'/>
        <Average />
        <Quote name='平均分差值'/>
        <Difference />
        <Quote name='个人擅长方向'/>
        <Good />
      </div>
    )
  }
})