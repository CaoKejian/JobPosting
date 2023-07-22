import { PropType, defineComponent, ref } from 'vue';
import s from './HandWork.module.scss';
export const HandWork = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>HandWork</div>
    )
  }
})
