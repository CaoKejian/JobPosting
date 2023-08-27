import { PropType, defineComponent, ref } from 'vue';
import s from './Auth.module.scss';
export const Auth = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Auth</div>
    )
  }
})