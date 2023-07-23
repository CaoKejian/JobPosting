import { PropType, defineComponent, ref } from 'vue';
import s from './Statistics.module.scss';
export const Statistics = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Statistics</div>
    )
  }
})

export default Statistics