import { PropType, defineComponent, ref } from 'vue';
import s from './Analyze.module.scss';
export const Analyze = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>敬请期待</div>
    )
  }
})

export default Analyze
