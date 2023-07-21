import { PropType, defineComponent, ref } from 'vue';
import s from './Login.module.scss';
import { MainLayout } from '../layouts/MainLayout';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <MainLayout>{
        {
          title:() => '1',
          fTitle:() => '1',
          default:() => '2'
        }
      }</MainLayout>
    )
  }
})

export default Login