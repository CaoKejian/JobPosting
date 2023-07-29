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

export const HandWork = defineComponent({
  setup: (props, context) => {
    // 班级map
    const classMap: Record<string, string> = {
      '123123': '大数据B201'
    }
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
    const isShowVisible = ref<boolean>(false)
    const formData = reactive({
      classId: '',
      subject: subjectArr.value[0].text,
      branch: '',
      fileName: '',
      fileUrl: ''
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
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      const classId = localStorage.getItem('classID') as string
      formData.classId = classMap[classId] ? classMap[classId] : classId
    })
    watch(() => formData.subject, (newValue, oldValue) => {
      console.log(newValue);
    })
    const afterRead = (file: any) => {
      let formDataFile = new FormData();
      formDataFile.append('file', file.file); // 上传的文件在 file 对象的 file 属性中
      // 发送文件上传请求到后端
      http.post('/upload/file', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response: any) => {
        Toast({
          message: `上传成功！`,
        });
        Object.assign(formData, {
          fileName: response.data.fileName,
          fileUrl: response.data.url
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
      if (!formData.fileUrl) {
         Toast({
          message: '请上传文件'
        })
        return
      }
      if (!hasError(errors)) {
        console.log('没错误');
      } else {
        console.log(errors);
      }
    }, 1000)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowVisible.value = true} />,
          title: () => '提交作业',
          default: () => <div>
            <Form onSubmit={onSubmit}>
              <FormItem label='班级' type='text' v-model={formData.classId}
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
              <div class={s.upload}>
                <span class={s.title}>上传作业</span>
                <van-uploader
                  after-read={afterRead}
                  v-model={fileList.value}
                  max-count={1}
                  deletable={true}
                  accept=".doc,.docx,.pdf,.ppt,.pptx,.xlsx,.xls,.jpg,.png,.jpeg"
                />
              </div>
              <div class={s.button}>
                <Button type='submit'>提交</Button>
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

export default HandWork