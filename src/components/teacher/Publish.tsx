import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Publish.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { DatetimePicker, Popup } from 'vant';
import { Button } from '../../shared/Button';
import { Rules, hasError, validate } from '../../shared/Validate';
export const Publish = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref<boolean>(false)
    const formData = reactive({
      classId: '',
      subject: '',
      branch: '',
      endTime: '',
      content: ''
    })
    const selectData = reactive({
      classMap: [
        { value: '123123', text: '大数据B201' },
        { value: '122122', text: '智能B222' },
      ],
      subjectMap: [
        { value: '1', text: 'React' },
        { value: '2', text: '数据挖掘' },
      ],
      branchMap: [
        { value: '1', text: '组件定义' },
        { value: '2', text: '抖音数据分析' },
      ]
    })
    const errors = reactive({
      classId: [],
      subject: [],
      branch: [],
      endTime: [],
      content: []
    })
    const publish = () => {
      Object.assign(errors, { classId: [], subject: [], branch: [], endTime: [], content: [] })
      const rules: Rules<typeof formData> = [
        { key: 'classId', type: 'required', message: '必须选择班级' },
        { key: 'subject', type: 'required', message: '必须选择学科' },
        { key: 'branch', type: 'required', message: '必须选择作业分支' },
        { key: 'endTime', type: 'required', message: '必须选择截止日期' },
      ]
      Object.assign(errors, validate(formData, rules))
      if (!hasError(errors)) {
        console.log(formData)
      }
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '发布作业',
          default: () => <div class={s.content}>
            <Form>
              <FormItem label='班级' type='select'
                options={selectData.classMap}
                v-model={formData.classId} 
                error={errors.classId?.[0] ?? '　'}>
              </FormItem>
              <FormItem label='学科' type='select'
                options={selectData.subjectMap}
                v-model={formData.subject} 
                error={errors.subject?.[0] ?? '　'}>
              </FormItem>
              <FormItem label='分支' type='select'
                options={selectData.branchMap}
                v-model={formData.branch}
                error={errors.branch?.[0] ?? '　'} >
              </FormItem>
              <FormItem label='截止时间'
                v-model={formData.endTime} type='date'
                error={errors.endTime?.[0] ?? '　'}
              ></FormItem>
              <FormItem label='作业描述' type='text'
                v-model={formData.content} >
              </FormItem>
              <div class={s.button}>
                <Button onClick={publish}>发布作业</Button>
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