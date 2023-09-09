import { PropType, defineComponent } from 'vue';
import s from './StatisList.module.scss';
import { WeekFrequency } from '../analyze/WeeFrequencey';
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
          <div>1</div>
        ) : props.id === '2' ? (
          <div>2</div>
        ) : props.id === '3' ? (
          <div>3</div>
        ) : null
      }
    </div>
    )
  }
})
