import { PropType, defineComponent, ref } from 'vue';
import s from './Login.module.scss';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Login</div>
    )
  }
})