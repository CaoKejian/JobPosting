import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
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
  setup: () => {
    const formData = reactive({
      stuId: '2001',
      email: '',
      code: '',
      name: ''
    })
    const errors = reactive({
      stuId: [],
      email: [],
      code: [],
      name:[]
    })
    const refValidationCode = ref<any>('')
    const { ref: refDisabled } = useBool(false)
    const modelVisible = ref<boolean>(false)
    const canModifyName = ref<boolean>()
    const modelValue = ref<number>(0)
    const route = useRoute()
    const router = useRouter()
    const onSubmit = throttle(async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        id: [], email: [], code: [], name: []
      })
      const reules: Rules<typeof formData> = [
        { key: 'stuId', type: 'required', message: '必填' },
        { key: 'email', type: 'required', message: '必填' },
        { key: 'name', type: 'required', message: '必填' },
        { key: 'email', type: 'pattern', regex: /.+@.+/, message: '必须是邮箱地址' },
        { key: 'code', type: 'required', message: '必填' },
        { key: 'code', type: 'pattern',regex: /^\d{6}$/, message: '六位数字验证码' }
      ]
      Object.assign(errors, validate(formData, reules))
      if (!hasError(errors)) {
        try {
          const res = await http.post('/user/veifycode', {code: formData.code}, { _autoLoading: true })
          if(res.status===200){
            const jwt = res.headers.authorization?.split(' ')[1]
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
      await http.post('/user', formData)
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
        return
        localStorage.setItem('stuId', formData.stuId)
        localStorage.setItem('skip', '1')
      } else {
        console.log('信息不完整');
      }
    }
    const changeModelValue =(value: number) => {
      modelValue.value = value
      if(modelValue.value!==0){
        Toast({
          message: '功能暂时关闭！'
        })
        return
        router.push('/student/detail')
      }
    }
    watch(()=> formData.stuId, async () => {
      const data = await http.get<{name:string,email:string}>('/class/stuid/name', {stuId:+formData.stuId},{_autoLoading:true})
      if(data.data.name === ''){
        canModifyName.value = true
      }
      canModifyName.value  = data.data.name ? true : false
      formData.name = data.data.name
      formData.email = data.data.email
    }, { immediate: true })
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
                <FormItem label='姓名' type='text' v-model={formData.name}
                  InputDisabled={canModifyName.value}
                  placeholder='请手动输入姓名' error={errors.name?.[0] ?? '　'}></FormItem>
                <FormItem label='邮箱' type='text' v-model={formData.email}
                  placeholder='请输入邮箱，然后点击发送验证码' error={errors.email?.[0] ?? '　'}></FormItem>
                <FormItem ref={refValidationCode} countForm={60} label='验证码' type='validationcode'
                  placeholder='请输入六位数字'
                  disabled={refDisabled.value}
                  onClick={onClickSendValidationCode}
                  v-model={formData.code} error={errors.code?.[0] ?? '　'}
                ></FormItem>
                <div style={{margin: '0',fontSize: '1rem', color:'var(--theme-font-color)'}}>
                  <p>如果面试官/体验着时间紧迫，验证码可以填入：<span style={{margin:'0 0.4rem',color: 'var(--error-color)'}}>111111</span>校验通过</p>
                  <div>
                    <p>另给出测试账号「只输入学号即可」</p>
                    <p>学号：2001 　　(老师账号)</p>
                    <p>学号：2001063037 　　(学生账号)</p>
                  </div>
                </div>
                <FormItem style={{ paddingTop: '28px' }}>
                  <div class={s.submit}>
                    <Button type='button' onClick={() => gotoInfo()}>免邮登录</Button>
                    <Button type='submit'>登录</Button>
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