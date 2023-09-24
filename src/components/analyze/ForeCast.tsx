import { PropType, defineComponent, ref } from 'vue';
import s from './WeekFrequency.module.scss';
export const ForeeCast = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>ForeeCast</div>
    )
  }
})