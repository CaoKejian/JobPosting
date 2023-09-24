import { PropType, defineComponent, ref } from 'vue';
import s from '../students/Analyze.module.scss';
import { History } from '../analyze/History';
import { Difficulty } from '../analyze/Difficulty';
import { HandAnalyze } from '../analyze/HandAnalyze';
import { ForeeCast } from '../analyze/ForeCast';
export const AnalyzeList = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (<div class={s.wrapper} style={{ fontSize: '1rem' }}>
      {
        props.id === '0' ? (
          <History />
        ) : props.id === '1' ? (
          <Difficulty />
        ) : props.id === '2' ? (
          <HandAnalyze />
        ) : props.id === '3' ? (
          <ForeeCast />
        ) : <div>网页异常，请刷新重试！</div>
      }
    </div>
    )
  }
})