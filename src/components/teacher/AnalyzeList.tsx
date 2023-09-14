import { PropType, defineComponent, ref } from 'vue';
import s from '../students/Analyze.module.scss';
import { History } from '../analyze/History';
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
          2
        ) : props.id === '2' ? (
          3
        ) : props.id === '3' ? (
          4
        ) : <div>网页异常，请刷新重试！</div>
      }
    </div>
    )
  }
})