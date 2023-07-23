import { PropType, defineComponent, ref } from 'vue';
import s from './DownLoads.module.scss';
export const DownLoads = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>DownLoads</div>
    )
  }
})

export default DownLoads