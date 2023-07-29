import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
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
import { http } from '../shared/Http';
import { Toast } from 'vant';
export const Login = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: () => {
    const formData = reactive({
      stuId: '2001063037',
      email: '1849201815@qq.com',
      code: '123123'
    })
    const errors = reactive({
      stuId: [],
      email: [],
      code: []
    })
    const refValidationCode = ref<any>('')
    const { ref: refDisabled } = useBool(false)
    const modelVisible = ref<boolean>(false)
    const modelValue = ref<number>(0)
    const route = useRoute()
    const router = useRouter()
    const onSubmit = throttle(async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        id: [], email: [], code: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'stuId', type: 'required', message: '必填' },
        { key: 'email', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
        { key: 'code', type: 'pattern',regex: /^\d{6}$/, message: '六位数字验证码' }
      ]
      Object.assign(errors, validate(formData, reules))
      if (!hasError(errors)) {
        console.log('成功,发送请求')
        try {
          const res = await http.post('/user/veifycode', {code: formData.code}, { _autoLoading: true })
          if(res.status===200){
            const jwt = res.headers.authorization.split(' ')[1]
            localStorage.setItem('jwt',jwt)
            localStorage.setItem('info',JSON.stringify(formData))
            const returnTo = route.query.return_to?.toString()
            if(returnTo){
              router.push(returnTo)
            }else{
              router.back()
            }
          }
          return res
        }catch(error:any){
          console.log(error);
          if(error.response.data.code===401){
            Toast({
              message: '验证码错误',
            });
          }
        }
      } else {
        console.log('信息不完整', errors);
      }
    },1000)
    const onClickSendValidationCode = async () => {
      console.log('发送校验信息');
      await http.post('/user', formData, { _autoLoading: true })
      await http.post('/user/email', formData ,{_autoLoading: true})
      refValidationCode.value.startCount()
    }
    const gotoInfo = () => {
      Object.assign(errors, {
        id: [], email: [], code: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'stuId', type: 'required', message: '必填' }
      ]
      Object.assign(errors, validate(formData, reules))
      if (!hasError(errors)) {
        modelVisible.value = true
        console.log('我已经免邮登录了')
        localStorage.setItem('stuId', formData.stuId)
        localStorage.setItem('skip', '1')
      } else {
        console.log('信息不完整');
      }
    }
    const changeModelValue =(value: number) => {
      modelValue.value = value
      if(modelValue.value!==0){
        router.push('/student/detail')
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
              <h1>交作业啦</h1>
            </div>
            <div class={s.form}>
              <Form onSubmit={onSubmit}>
                <FormItem label='学号' type='text' v-model={formData.stuId}
                  placeholder='请输入学号' error={errors.stuId?.[0] ?? '　'}></FormItem>
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
              <Model v-model:modelVisible={modelVisible.value} v-model:modelValue={modelValue.value} onUpdate:modelValue={(e) => changeModelValue(e)}>{
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