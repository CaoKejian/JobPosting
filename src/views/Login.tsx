import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Login.module.scss';
import { MainLayout } from '../layouts/MainLayout';
import { Form, FormItem } from '../shared/Form';
import { useBool } from '../hooks/useBool';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: () => {
    const formData = reactive({
      id:'12',
      email: '1849201815@qq.com',
      code: '123456'
    })
    const refValidationCode = ref<any>('')
    const { ref: refDisabled } = useBool(false)
    const onSubmit = (e: Event) => {
      e.preventDefault()
    }
    const onClickSendValidationCode = async () => {
      console.log(1);
      refValidationCode.value.startCount()
    }
    return () => (
      <MainLayout>{
        {
          title: () => '查你信息',
          default: () => <div class={s.wrapper}>
            <div class={s.header}>
              <svg class={s.svg}><use xlinkHref='#vite'></use></svg>
              <h1>来交作业啦</h1>
            </div>
            <div class={s.form}>
              <Form onSubmit={onSubmit}>
                <FormItem label='学号' type='text' v-model={formData.id}
                  placeholder='请输入学号'></FormItem>
                <FormItem label='邮箱' type='text' v-model={formData.email}
                  placeholder='请输入邮箱，然后点击发送验证码'></FormItem>
                <FormItem ref={refValidationCode} countForm={60} label='验证码' type='validationcode'
                  placeholder='请输入六位数字'
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code}
                ></FormItem>
              </Form>
            </div>
          </div>
        }
      }</MainLayout>
    )
  }
})

export default Login