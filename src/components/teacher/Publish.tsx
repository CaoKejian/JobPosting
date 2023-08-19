import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './Publish.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { Rules, hasError, validate } from '../../shared/Validate';
import { http } from '../../shared/Http';
import { classIdMapFunction, teacherMapFunction } from '../../config/NameMap';
import { Timestamp } from '../../shared/Time';
import { pubWork } from '../../vite-env';
import { Toast } from 'vant';
export const Publish = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref<boolean>(false)
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
    const formData = reactive<pubWork>({
      user: '',
      classId: selectData.classMap[0].text,
      subject: selectData.subjectMap[0].text,
      branch: selectData.branchMap[0].text,
      cutTime: undefined,
      content: ''
    })
    const errors = reactive({
      classId: [],
      subject: [],
      branch: [],
      cutTime: [],
      content: []
    })
    onMounted(() => {
      formData.user = teacherMapFunction(JSON.parse(localStorage.getItem('info') as string).stuId)
    })
    const publish = async () => {
      Object.assign(errors, { classId: [], subject: [], branch: [], cutTime: [], content: [] })
      const rules: Rules<typeof formData> = [
        { key: 'classId', type: 'required', message: '必须选择班级' },
        { key: 'subject', type: 'required', message: '必须选择学科' },
        { key: 'branch', type: 'required', message: '必须选择作业分支' },
        { key: 'cutTime', type: 'required', message: '必须选择截止日期' },
      ]
      Object.assign(errors, validate(formData, rules))
      if (!hasError(errors)) {
        formData.cutTime = Timestamp(String(formData.cutTime))
        formData.classId = classIdMapFunction(formData.classId)
        try {
          await http.post('/pub', formData, { _autoLoading: true })
          Object.assign(formData, { cutTime: '', content: '' })
          Toast({
            message: '发布成功！'
          })
        } catch (err) {
          console.log(err)
        }
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
                v-model={formData.cutTime} type='date'
                error={errors.cutTime?.[0] ?? '　'}
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