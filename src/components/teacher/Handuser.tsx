import { PropType, defineComponent, ref } from 'vue';
import s from './Handuser.module.scss';
export const Handuser = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Handuser</div>
    )
  }
})