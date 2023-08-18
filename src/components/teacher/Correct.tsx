import { PropType, defineComponent, ref } from 'vue';
import s from './Correct.module.scss';
export const Correct = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Correct</div>
    )
  }
})