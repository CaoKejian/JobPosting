import { PropType, defineComponent, reactive, ref, toRefs } from 'vue';
import s from './Handuser.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { MenuBar } from '../../layouts/MenuBar';
import { Button } from '../../shared/Button';
import { Toast } from 'vant';
import { http } from '../../shared/Http';
export const Handuser = defineComponent({
  setup: (props, context) => {
    const useData = reactive({
      isShowMenu: false,
      formData: [],
      status: '',
      svg: '#isHandinfo',
      action: 'running'
    })
    const { isShowMenu, formData, status, svg, action } = toRefs(useData)
    const afterRead = (file: any) => {
      let formDataFile = new FormData();
      formDataFile.append('file', file.file);
      console.log(file)
      console.log(formDataFile.get('file'))
      http.post('/upload/file', formDataFile, {
        _autoLoading: true
      }).then((response: any) => {
        console.log(response)
        Toast({
          message: `上传成功！`,
        });
        Object.assign(formData, {
          file: {
            fileName: response.data.fileName,
            fileUrl: response.data.url
          }
        });
        status.value = '数据正在处理入库，请稍后...'
        setTimeout(() => {
          handleData()
        }, 2000);
      }).catch(error => {
        Toast({
          message: `上传失败！${error}`,
        });
        status.value = '处理失败，请检查网络原因！'
        svg.value = '#error'
      });
    }
    const handleData = () => {
      status.value = '处理完成！'
      svg.value = '#success'
      action.value = 'paused'
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '上传用户',
          default: () => <div class={s.wrapper}>
            <Quote name='上传csv文件，需至少姓名、学号两列数据' />
            <div class={s.upload}>
              <van-uploader
                after-read={afterRead}
                v-model={formData.value}
                max-count={1}
                deletable={true}
                accept=".xlsx"
              >
                <Button>上传表单文件</Button>
              </van-uploader>
            </div>
            {
              status.value ?
                <div class={s.status}><svg class={s.svg} style={{
                  animationPlayState: `${action.value}`
                }}><use xlinkHref={svg.value}></use></svg>{status.value}</div>
                : null
            }
            <p>注：此过程会持续导入表单学生信息</p>
            <p>保证表格有<span class={s.content}>name</span>（姓名）和<span class={s.content}>stuId</span>（学号）两列数据</p>
            {
              isShowMenu.value ?
                <MenuBar onClose={() => isShowMenu.value = false} />
                : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})