import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './HandWork.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Form, FormItem } from '../../shared/Form';
import { Toast } from 'vant';
import { http } from '../../shared/Http';

export const HandWork = defineComponent({
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(false)
    const formData = reactive({
      classId: '',
      subject: 'chinese',
      fileName: '',
      fileUrl: ''
    })
    const fileList = ref([
    ]);
    const toast = () => {
      Toast({
        message: '不能修改班级码',
      });
    }
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      const classId = localStorage.getItem('classID') as string
      formData.classId = classId
    })
    watch(() => formData.subject, () => {
      console.log(formData.subject);
    })
    const afterRead = (file: any) => {
      let formDataFile = new FormData();
      formDataFile.append('file', file.file); // 上传的文件在 file 对象的 file 属性中
      // 发送文件上传请求到后端
      http.post('/upload/file', formDataFile, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response:any) => {
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
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowVisible.value = true} />,
          title: () => '提交作业',
          default: () => <div>
            <Form>
              <FormItem label='班级' type='text' v-model={formData.classId}
                onClick={toast}
              InputDisabled={true}></FormItem>
              <FormItem label='学科' type='select'
                options={[
                  { value: 'chinese', text: '语文' },
                  { value: 'english', text: '英语' }
                ]} v-model={formData.subject}
              >
              </FormItem>
            </Form>
            <div class={s.upload}>
              <van-uploader
                after-read={afterRead}
                v-model={fileList.value}
                max-count={1}
                deletable={true}
                accept=".doc,.docx,.pdf,.ppt,.pptx,.xlsx,.xls,.jpg,.png,.jpeg"
              />
            </div>
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