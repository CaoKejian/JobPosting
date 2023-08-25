import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './HandWork.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Toast } from 'vant';
import { http } from '../../shared/Http';
import { Button } from '../../shared/Button';
import { throttle } from '../../shared/Throttle';
import { Rules, hasError, validate } from '../../shared/Validate';
import { useRoute, useRouter } from 'vue-router';
import { classMap } from '../../config/NameMap';
import { Class, Work } from '../../vite-env';
import { Quote } from '../../shared/Quote';
import { Time } from '../../shared/Time';

export const HandWork = defineComponent({
  setup: (props, context) => {
    const className = ref<string>('')
    const isReady = ref<boolean>(false)
    const submitInfo = reactive<{
      subjectArr: { value: string, text: string }[],
      branchArr: { value: string, text: string }[]
    }>({
      subjectArr: [],
      branchArr: [],
    })
    const router = useRouter()
    const route = useRoute()
    const isShowVisible = ref<boolean>(false)
    const formData = reactive({
      id: '',
      classId: 0,
      stuId: '',
      subject: '',
      branch: '',
      favor: false,
      content: '',
      score: 0,
      tComments: '',
      isPass: false,
      user: '',
      cutTime: 0,
      file: {
        fileName: '',
        fileUrl: ''
      }
    })
    const errors = reactive({
      classId: [],
      subject: [],
      branch: []
    })
    const fileList = ref([]);
    const toast = () => {
      Toast({
        message: '不能修改班级码',
      });
    }
    const fetchBranchCutTime = async (branch: string) => {
      try {
        const data = await http.get<Work>('/pub/branch',
          {
            branch,
            classId: formData.classId,
            subject: formData.subject
          },
          { _autoLoading: true })
        Object.assign(formData, {
          cutTime: data.data.cutTime,
          user: data.data.user,
          content: data.data.content
        })
      } catch (err) {
        console.log(err)
      }
    }
    const fetchUploadWork = async (id: string) => {
      try {
        const response = await http.get<Work>('/work/upload/work', { id }, { _autoLoading: true })
        console.log(response)
        const data = response.data
        formData.subject = data.subject
        formData.branch = data.branch
        isReady.value = true
      } catch (error) {
        console.log(error)
      }
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
          submitInfo.subjectArr.push(subjectObj);
        });
      } catch (err) {
        console.log(err)
      }
    }
    const fetchBranchData = async (subject: string) => {
      try {
        Object.assign(submitInfo, {
          branchArr: []
        })
        const data = await http.get<Class>('pub/subject/branch', { subject }, { _autoLoading: true })
        console.log(data)
        const branches = data.data.branches
        branches.forEach((item, index) => {
          const branchObj = {
            value: `${index} + 1`,
            text: item
          };
          submitInfo.branchArr.push(branchObj);
        });
      } catch (err) {
        console.log(err)
      }
    }
    onMounted(() => {
      formData.id = Array.isArray(route.params.id) ? route.params.id.join('') : route.params.id
      if (formData.id !== 'submit') {
        fetchUploadWork(formData.id)
      }
      const info = JSON.parse(localStorage.getItem('info') as string)
      formData.stuId = info.stuId
      const classId = Number(localStorage.getItem('classID'))
      fetchSubjectData(classId)
      formData.classId = classId
      className.value = classMap[classId] ? classMap[classId] : String(classId)
      isReady.value = true
    })
    watch(() => formData.branch, (newValue, oldValue) => {
      fetchBranchCutTime(newValue)
    })
    watch(() => formData.subject, (newValue, oldValue) => {
      fetchBranchData(newValue)
    })
    const afterRead = (file: any) => {
      let formDataFile = new FormData();
      formDataFile.append('file', file.file); // 上传的文件在 file 对象的 file 属性中
      // 发送文件上传请求到后端
      http.post('/upload/file', formDataFile, {
        _autoLoading: true
      }).then((response: any) => {
        Toast({
          message: `上传成功！`,
        });
        Object.assign(formData, {
          file: {
            fileName: response.data.fileName,
            fileUrl: response.data.url
          }
        });
      }).catch(error => {
        Toast({
          message: `上传失败！${error}`,
        });
      });
    }
    // 提交函数
    const onSubmit = throttle(async (e: Event) => {
      e.preventDefault()
      Object.assign(errors, {
        classId: [], subject: [], branch: []
      })
      const rules: Rules<typeof formData> = [
        { key: 'classId', type: 'required', message: '必填' },
        { key: 'subject', type: 'required', message: '必须选择学科' },
        { key: 'branch', type: 'required', message: '必须选择作业分支' },
      ]
      Object.assign(errors, validate(formData, rules))
      if (!formData.file.fileUrl) {
        Toast({
          message: '请上传文件'
        })
        return
      }
      if (!hasError(errors)) {
        Object.assign(formData, {
          classId: '123123'
        })
        try {
          if (formData.id !== '' && formData.id !== 'submit') {
            await http.post('/work/upload', formData, { _autoLoading: true })
          } else {
            await http.post('/work/submit', formData, {
              _autoLoading: true
            })
          }
          Toast({
            message: '提交成功'
          })
          router.push('/student/detail')
        } catch (error: any) {
          if (error.response.status === 402) {
            Toast({
              message: error.response.data.message
            })
          }
        }
      }
    }, 1000)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowVisible.value = true} />,
          title: () => '提交作业',
          default: () => <div>
            {isReady.value ?
              <Form onSubmit={onSubmit}>
                <FormItem label='班级' type='text' v-model={className.value}
                  onClick={toast}
                  InputDisabled={true}
                  error={errors.classId?.[0] ?? '　'}
                ></FormItem>
                <FormItem label='学科' type='select'
                  options={submitInfo.subjectArr}
                  v-model={formData.subject}
                  error={errors.subject?.[0] ?? '　'}
                >
                </FormItem>
                <FormItem label='作业分支' type='select'
                  options={submitInfo.branchArr} v-model={formData.branch}
                  error={errors.branch?.[0] ?? '　'}
                ></FormItem>
                <div class={s.endTime}>
                  <p>截止时间</p>
                  {
                    formData.cutTime ?
                      <Quote name={Time(formData.cutTime, 'YY-MM-SS')} />
                      : '　'
                  }
                </div>
                <div class={s.upload}>
                  <span class={s.title}>上传作业(提交命名格式：学号-作业分支名.docx等)</span>
                  <van-uploader
                    after-read={afterRead}
                    v-model={fileList.value}
                    max-count={1}
                    deletable={true}
                    accept=".doc,.docx,.pdf,.ppt,.pptx,.xlsx,.xls,.jpg,.png,.jpeg"
                  />
                </div>
                {
                  formData.branch !== '' ?
                    <div class={s.info}>
                      <span>发布者： <span class={s.main}>{formData.user}</span></span>
                      <span>作业描述:  <div class={[s.main, s.content]}>{formData.content}</div></span>
                    </div> : null
                }

                <div class={s.button}>
                  <Button type='submit'>提交</Button>
                </div>
              </Form> :
              null
            }
            {
              isShowVisible.value ?
                <MenuBar onClose={() => isShowVisible.value = false} /> :
                null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})

export default HandWork