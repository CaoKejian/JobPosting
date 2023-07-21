import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Login.module.scss';
import { MainLayout } from '../layouts/MainLayout';
import { Form, FormItem } from '../shared/Form';
import { useBool } from '../hooks/useBool';
import { Rules, hasError, validate } from '../shared/Validate';
import { Button } from '../shared/Button';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: () => {
    const formData = reactive({
      id:'',
      email: '',
      code: ''
    })
    const errors = reactive({
      id:[],
      email: [],
      code: []
    })
    const refValidationCode = ref<any>('')
    const { ref: refDisabled } = useBool(false)
    const onSubmit = (e: Event) => {
      // e.preventDefault()
      Object.assign(errors, {
        id:[], email: [], code: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'id', type: 'required', message: '必填' },
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
      ]
      Object.assign(errors, validate(formData, reules))

      if(!hasError(errors)){
        console.log('成功,发送请求')
      }else{
        console.log('信息不完整');
        
      }
    }
    const onClickSendValidationCode = async () => {
      console.log('发送校验信息');
      
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
                  placeholder='请输入学号' error={errors.email?.[0] ?? '　'}></FormItem>
                <FormItem label='邮箱' type='text' v-model={formData.email}
                  placeholder='请输入邮箱，然后点击发送验证码' error={errors.email?.[0] ?? '　'}></FormItem>
                <FormItem ref={refValidationCode} countForm={60} label='验证码' type='validationcode'
                  placeholder='请输入六位数字'
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code} error={errors.code?.[0] ?? '　'}
                ></FormItem>
                 <FormItem style={{ paddingTop: '28px' }}>
                  <Button type='submit'>登录</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        }
      }</MainLayout>
    )
  }
})

export default Login