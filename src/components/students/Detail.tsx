import { PropType, defineComponent, ref } from 'vue';
import s from './Detail.module.scss';
export const Detail = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Detail</div>
    )
  }
})

export default Detail