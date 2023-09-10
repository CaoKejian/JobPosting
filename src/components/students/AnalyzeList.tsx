import { PropType, defineComponent } from 'vue';
import s from './StatisList.module.scss';
import { WeekFrequency } from '../analyze/WeeFrequencey';
import { Selfgood } from '../analyze/Selfgood';
import { Habit } from '../analyze/Habit';
export const AnalyzeList = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (<div class={s.wrapper} style={{fontSize: '1rem'}}>
      {
        props.id === '0' ? (
          <WeekFrequency />
        ) : props.id === '1' ? (
          <Selfgood />
        ) : props.id === '2' ? (
          <Habit />
        ) : props.id === '3' ? (
          <div>3</div>
        ) : null
      }
    </div>
    )
  }
})
