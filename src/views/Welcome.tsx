import { PropType, defineComponent, ref } from 'vue';
import s from './Welcome.module.scss';
export const Welcome = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>Welcome</div>
    )
  }
})

export default Welcome