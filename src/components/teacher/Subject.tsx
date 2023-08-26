import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './Subject.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { classIdMapFunction, classMap } from '../../config/NameMap';
import { Rules, hasError, validate } from '../../shared/Validate';
import { http } from '../../shared/Http';
import { Toast } from 'vant';
import { MenuBar } from '../../layouts/MenuBar';
export const Subject = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref(false)
    const selectData = reactive<{
      classOpt: {value:string,text:string}[]
    }>({
      classOpt: []
    })
    const formData = reactive({
      classId: '',
      subject: '',
      user: ''
    })
    const errors = reactive({
      classId: [],
      subject: [],
      user: []
    })
    const publish = async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, { classId: [], subject: [], user: [] })
      const rules: Rules<typeof formData> = [
        { key: 'classId', type: 'required', message: '必须选择班级' },
        { key: 'subject', type: 'required', message: '必须选择学科' },
        { key: 'user', type: 'required', message: '要确认身份' },
      ]
      Object.assign(errors, validate(formData, rules))
      if (!hasError(errors)) {
        formData.classId = classIdMapFunction(formData.classId)
        try {
          await http.post('/subject', formData, { _autoLoading: true })
          Toast({
            message: '发布成功！'
          })
          Object.assign(formData, { classId: selectData.classOpt[0].text, subject: '' })
        } catch (err: any) {
          console.log(err)
          if (err.response?.status === 402) {
            Object.assign(formData, { classId: selectData.classOpt[0].text, subject: '' })
            Toast({
              message: err.response.data.message
            })
          }
        }
      }
    }
    const setClassMapSelection = () => {
      for (const [value,text] of Object.entries(classMap)) {
        selectData.classOpt.unshift({value,text})
      }
      formData.classId = selectData.classOpt[0].text
    }
    onMounted(() => {
      formData.user = JSON.parse(localStorage.getItem('info') as string).name
      setClassMapSelection()
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '新的学科',
          default: () => <div class={s.content}>
            <p><Quote name='发布学科' /></p>
            <Form>
              <FormItem label='班级' type='select' options={selectData.classOpt} v-model={formData.classId} error={errors.classId?.[0] ?? '　'}></FormItem>
              <FormItem label='学科' type='text' v-model={formData.subject} placeholder='请输入要发布的学科' error={errors.subject?.[0] ?? '　'}></FormItem>
              <FormItem label='确认发布人' type='text' v-model={formData.user} placeholder='还未登录/登录信息有误' InputDisabled={true} error={errors.user?.[0] ?? '　'}></FormItem>
              <div class={s.button}>
                <Button onClick={publish}>发布新学科</Button>
              </div>
            </Form>
            {
              isShowMenu.value ?
                <MenuBar name={'teacher'} onClose={() => isShowMenu.value = false} />
                : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})