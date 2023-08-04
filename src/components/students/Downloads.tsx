import { PropType, defineComponent, onMounted, reactive, ref } from 'vue';
import s from './DownLoads.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Toast } from 'vant';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { classMap } from '../../config/NameMap';

export const DownLoads = defineComponent({
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(false)
    const className = ref<string>('')
    const subjectArr = ref([
      { value: 'a', text: '数据挖掘' },
      { value: 'b', text: 'React' },
      { value: 'c', text: '英语' },
    ])
    const branchArr = ref([
      { value: '数据挖掘', text: '抖音数据清洗' },
      { value: '数据挖掘', text: '百度数据挖掘' },
      { value: 'React', text: '类组件定义' },
    ])
    const formData = reactive({
      classId: '',
      stuId: '',
      subject: subjectArr.value[0].text,
      branch: '',
    })
    const errors = reactive({
      classId: [],
      subject: [],
      branch: []
    })
    const isNoSubmit = ref(['曹珂俭', '曹珂俭俭', '曹珂俭', '曹珂俭', '曹珂俭', '曹珂俭', '曹珂俭'])
    const onSubmit = () => {

    }
    const toast = () => {
      Toast({
        message: '不能修改班级码',
      });
    }
    onMounted(() => {
      const classId = localStorage.getItem('classID') || ''
      const info = JSON.parse(localStorage.getItem('info') as string)
      formData.stuId = info.stuId
      className.value = classMap[classId] ? classMap[classId] : classId
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowVisible.value = true} ></BackIcon>,
          title: () => '作业下载',
          default: () => <div class={s.wrapper}>
            <Form onSubmit={onSubmit}>
              <FormItem label='班级' type='text' v-model={className.value}
                onClick={toast}
                InputDisabled={true}
                error={errors.classId?.[0] ?? '　'}
              ></FormItem>
              <FormItem label='学科' type='select'
                options={subjectArr.value}
                v-model={formData.subject}
                error={errors.subject?.[0] ?? '　'}
              >
              </FormItem>
              <FormItem label='作业分支' type='select'
                options={branchArr.value} v-model={formData.branch}
                error={errors.branch?.[0] ?? '　'}
              ></FormItem>
              <div class={s.homework}>
                <span>已查到：<span class={s.number}>63份</span>作业</span>
                <span>还差：<span class={s.number}>7份</span>作业</span>
              </div>
              <span class={s.unsubmit}>未交名单:</span>
              <div class={s.fake}>
                {isNoSubmit.value.map(item => {
                  return <span class={s.item}>
                      {item}
                  </span>
                })}
              </div>
              <div class={s.button}>
                <Button type='submit'>直接下载</Button>
              </div>
            </Form>
            {isShowVisible.value ?
              <MenuBar style={s.overlay} onClose={() => isShowVisible.value = false} /> :
              null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})

export default DownLoads