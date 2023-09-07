import { PropType, defineComponent } from 'vue';
import s from './StatisList.module.scss';
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
          <div>0</div>
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

// 此页面为内容页面