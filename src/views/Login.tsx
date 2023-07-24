import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Login.module.scss';
import { MainLayout } from '../layouts/MainLayout';
import { Form, FormItem } from '../shared/Form';
import { useBool } from '../hooks/useBool';
import { Rules, hasError, validate } from '../shared/Validate';
import { Button } from '../shared/Button';
import { Model } from '../shared/Model';
import { useRoute, useRouter } from 'vue-router';
import { BackIcon } from '../shared/BackIcon';
import { throttle } from '../shared/Throttle';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: () => {
    const formData = reactive({
      id: '',
      email: '',
      code: ''
    })
    const errors = reactive({
      id: [],
      email: [],
      code: []
    })
    const refValidationCode = ref<any>('')
    const { ref: refDisabled } = useBool(false)
    const modelVisible = ref<boolean>(false)
    const route = useRoute()
    const router = useRouter()
    const onSubmit = throttle((e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        id: [], email: [], code: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'id', type: 'required', message: '必填' },
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
        { key: 'code', type: 'pattern',regex: /^\d{6}$/, message: '六位数字验证码' }
      ]
      Object.assign(errors, validate(formData, reules))
      if (!hasError(errors)) {
        console.log('成功,发送请求')
        const returnTo = route.query.return_to?.toString()
        router.push(returnTo || '/')
      } else {
        console.log('信息不完整');
      }
    },1000)
    const onClickSendValidationCode = async () => {
      console.log('发送校验信息');
      refValidationCode.value.startCount()
    }
    const gotoInfo = () => {
      Object.assign(errors, {
        id: [], email: [], code: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'id', type: 'required', message: '必填' }
      ]
      Object.assign(errors, validate(formData, reules))
      if (!hasError(errors)) {
        modelVisible.value = true
        console.log('我已经免邮登录了')
        localStorage.setItem('skip', '1')
        router.push('/student/detail')
      } else {
        console.log('信息不完整');
      }
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon />,
          title: () => "查你信息",
          default: () => <div class={s.wrapper}>
            <div class={s.header}>
              <svg class={s.svg}><use xlinkHref='#vite'></use></svg>
              <h1>来交作业啦</h1>
            </div>
            <div class={s.form}>
              <Form onSubmit={onSubmit}>
                <FormItem label='学号' type='text' v-model={formData.id}
                  placeholder='请输入学号' error={errors.id?.[0] ?? '　'}></FormItem>
                <FormItem label='邮箱' type='text' v-model={formData.email}
                  placeholder='请输入邮箱，然后点击发送验证码' error={errors.email?.[0] ?? '　'}></FormItem>
                <FormItem ref={refValidationCode} countForm={60} label='验证码' type='validationcode'
                  placeholder='请输入六位数字'
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code} error={errors.code?.[0] ?? '　'}
                ></FormItem>
                <FormItem style={{ paddingTop: '28px' }}>
                  <div class={s.submit}>
                    <Button type='submit'>登录</Button>
                    <Button type='button' onClick={() => gotoInfo()}>免邮登录</Button>
                  </div>
                </FormItem>
              </Form>
            </div>
            {modelVisible.value ?
              <Model v-model:modelVisible={modelVisible.value}>{
                {
                  title: () => '弹框',
                  content:() => '确认免邮登录吗？（不安全）',
                }
              }</Model> :
              null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})

export default Login