import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './DownLoads.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Toast } from 'vant';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { http } from '../../shared/Http';
import { Class, User, Work } from '../../vite-env';
import { DownLoadInfo } from '../../shared/DownLoad';
import { PeopleShow } from '../../shared/PeopleShow';
import { isHaveAuth } from '../../config/utils';
import { useInfoStore } from '../../store/useInfoStore';

export const DownLoads = defineComponent({
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const isShowVisible = ref<boolean>(false)
    const className = ref<string>('')
    const classId = ref<number>(0)
    const subjectArr = ref<{ value: string, text: string }[]>([])
    const branchArr = ref<{ value: string, text: string }[]>([])
    const formData = reactive({
      classId: '',
      stuId: '',
      subject: '',
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
      isNoSubmit.value = []
      isSubmit.value = []
      downloadsInfo.value = []
      //  发送请求 传入 newValue和classId
      await fetchBranchData(subject)
      if (branch === '') return
      try {
        const data = await http.get<any>('/work/download', {
          branch,
          subject: formData.subject,
          classId: classId.value
        }, { _autoLoading: true }) // 1 份 返回交的学号
        downloadsInfo.value = data.data.data.map((item: { file: {}, stuId: Number }) => ({
          file: item.file
        }))
        isSubmit.value = data.data.data.length === 0 ? [] : data.data.stuIds;
        if (isSubmit.value.length !== 0) {
          const unSubmit = await http.get<{ stuId: number, classId: number, name: string }[]>('/user/total', {
            classId: classId.value,
            stuIds: isSubmit.value
          })
          isNoSubmit.value = unSubmit.data
        } else {
          Toast({
            message: '没有相关作业提交'
          })
          // 查询所有班级下的同学
          const unSubmit = await http.get<{ stuId: number, classId: number, name: string }[]>('/user/demand', { classId: classId.value })
          isNoSubmit.value = unSubmit.data
        }
      } catch (e) {
        console.log(e);
      }
    })
    const onDownload = async (e: Event) => {
      e.preventDefault()
      try {
        isHaveAuth().then(async res => {
          if(res){
            for (const file of downloadsInfo.value) {
              await DownLoadInfo(file.file);
              await new Promise(resolve => setTimeout(resolve, 1000))
            }
            console.log('全部文件下载完成');
          }else{
            Toast({message:"你没有该权限！"})
          }
        })
      } catch (error) {
        console.error('提交出错：', error);
      }
    }
    const toast = () => {
      Toast({
        message: '不能修改班级码',
      });
    }
    const fetchSubjectData = async (classId: number) => {
      try {
        const data = await http.get<Class>('/subject/myclass/classId', { classId: classId }, { _autoLoading: true })
        const subjects = data.data.subjects
        subjects.forEach((item, index) => {
          const subjectObj = {
            value: `${index} + 1`,
            text: item
          };
          subjectArr.value.push(subjectObj);
        });
        if (subjectArr.value.length !== 0) {
          formData.subject = subjectArr.value[0].text
        }
      } catch (err) {
        console.log(err)
      }
    }
    const fetchBranchData = async (subject: string) => {
      try {
        branchArr.value = []
        const data = await http.get<Class>('pub/subject/branch', { subject }, { _autoLoading: true })
        const branches = data.data.branches
        branches.forEach((item, index) => {
          const branchObj = {
            value: `${index} + 1`,
            text: item
          };
          branchArr.value.push(branchObj);
        });
      } catch (err) {
        console.log(err)
      }
    }
    onMounted(async () => {
      classId.value = Number(localStorage.getItem('classID')) || 0
      const info = JSON.parse(localStorage.getItem('info') as string)
      formData.stuId = info.stuId
      className.value = infoStore.class[classId.value] ? infoStore.class[classId.value] : String(classId.value)
      await fetchSubjectData(classId.value)
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
                isNoSubmit.value.length !== 0 ? <>
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