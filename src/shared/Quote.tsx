import { PropType, defineComponent, ref } from 'vue';
import s from './Quote.module.scss';
export const Quote = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.line}></div>
        <div class={s.time}>{props.name}</div>
      </div>
    )
  }
})