import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './DownLoads.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Toast } from 'vant';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { classMap, stuIdMapFunction } from '../../config/NameMap';
import { http } from '../../shared/Http';
import { User, Work } from '../../vite-env';
import { DownLoadInfo } from '../../shared/DownLoad';
import { PeopleShow } from '../../shared/PeopleShow';

export const DownLoads = defineComponent({
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(false)
    const className = ref<string>('')
    const classId = ref<number>(0)
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
    const isSubmit = ref<[]>([])
    const downloadsInfo = ref<Work[]>([]) // 需要下载的文件
    const isNoSubmit = ref<{ stuId: number, classId: number }[]>([])
    watch(() => [formData.branch, formData.subject], async (newValue) => {
      const [branch, subject] = newValue
      //  发送请求 传入 newValue和classId
      try {
        const data = await http.get<any>('/work/download', {
          branch,
          subject,
          classId: classId.value
        }, { _autoLoading: true }) // 1 份 返回交的学号
        downloadsInfo.value = data.data.data.map((item: { file: {}, stuId: Number }) => ({
          file: item.file
        }))
        isSubmit.value = data.data.stuIds
        if (isSubmit.value.length !== 0) {
          const unSubmit = await http.get<{ stuId: number, classId: number }[]>('/user/total', {
            classId: classId.value,
            stuIds: isSubmit.value
          })
          isNoSubmit.value = unSubmit.data
        } else {
          Toast({
            message: '没有相关作业提交'
          })
          isNoSubmit.value = []
        }
      } catch (e) {
        console.log(e);
      }
    })
    const onDownload = async (e: Event) => {
      e.preventDefault()
      try {
        for (const file of downloadsInfo.value) {
          console.log(file)
          await DownLoadInfo(file.file);
          await new Promise(resolve => setTimeout(resolve, 1000))
        }
        console.log('全部文件下载完成');
      } catch (error) {
        console.error('提交出错：', error);
      }
    }
    const toast = () => {
      Toast({
        message: '不能修改班级码',
      });
    }
    onMounted(() => {
      classId.value = Number(localStorage.getItem('classID')) || 0
      const info = JSON.parse(localStorage.getItem('info') as string)
      formData.stuId = info.stuId
      className.value = classMap[classId.value] ? classMap[classId.value] : String(classId.value)
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowVisible.value = true} ></BackIcon>,
          title: () => '作业下载',
          default: () => <div class={s.wrapper}>
            <Form onSubmit={onDownload}>
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
                <span>已查到：<span class={s.number}>{isSubmit.value.length} 份</span></span>
                <br />
                <span>还　差：<span class={s.number}>{isNoSubmit.value.length} 份</span></span>
              </div>
              {
                isSubmit.value.length !== 0 ? <>
                  <span class={s.unsubmit}>未交名单:</span>
                  <PeopleShow array={isNoSubmit.value} />
                </> :
                  null
              }
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