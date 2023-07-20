import { PropType, defineComponent, ref } from 'vue';
import s from './Button.module.scss';
export const Button = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => ( 
      <button class={s.button}>{context.slots.default?.()}</button>
    )
  }
})