import { PropType, defineComponent, ref } from 'vue';
import s from './View.module.scss';
export const View = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>View</div>
    )
  }
})

export default View