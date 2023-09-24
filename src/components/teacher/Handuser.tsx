import { PropType, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import s from './Handuser.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { MenuBar } from '../../layouts/MenuBar';
import { Button } from '../../shared/Button';
import { Toast } from 'vant';
import { http } from '../../shared/Http';
import { PeopleShow } from '../../shared/PeopleShow';
import { useInfoStore } from '../../store/useInfoStore';
interface UseDataType {
  isShowMenu: boolean,
  formData: [],
  xfile: {
    fileName: string
    fileUrl: string
  }
  status: string,
  svg: string,
  action: string
  repeat: { name: string, stuId: number }[]
}
export const Handuser = defineComponent({
  setup: (props, context) => {
    const infoStore = useInfoStore()
    const useData = reactive<UseDataType>({
      isShowMenu: false,
      formData: [],
      xfile: {
        fileName: '',
        fileUrl: ''
      },
      status: '',
      svg: '#isHandinfo',
      action: 'running',
      repeat: []
    })
    const { isShowMenu, formData, xfile, status, svg, action, repeat } = toRefs(useData)
    const afterRead = (file: any) => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      if(infoStore.canHandUser.some(item => info.stuId.includes(item))){
        return Toast({message: '没有权限！'})
      }
      let formDataFile = new FormData();
      formDataFile.append('file', file.file);
      http.post('/upload/file', formDataFile, {
        _autoLoading: true
      }).then((response: any) => {
        console.log(response)
        Toast({
          message: `上传成功！`,
        });
        Object.assign(formData, {
          fileName: response.data.fileName,
          fileUrl: response.data.url
        });
        Object.assign(xfile.value, {
          fileName: response.data.fileName,
          fileUrl: response.data.url
        })
        status.value = '数据正在处理入库，请稍后...'
        Toast.loading({
          message: '正在处理，请稍等...',
          forbidClick: true,
        })
        handleData()
      }).catch(error => {
        Toast({
          message: `上传失败！${error}`,
        });
        status.value = '处理失败，请检查网络原因！'
        action.value = 'paused'
        svg.value = '#error'
      });
    }
    const handleData = async () => {
      const res = await http.post<{ data: string, repeat: { name: string, stuId: number }[] }>('/class/insertall', { url: xfile.value.fileUrl })
      repeat.value = res.data.repeat
      Toast.clear()
      status.value = '处理完成！'
      svg.value = '#success'
      action.value = 'paused'
    }
    console.log(repeat.value)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '上传用户',
          default: () => <div class={s.wrapper}>
            <Quote name='上传xlsx文件，需至少姓名、学号两列数据' />
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
              repeat.value.length !== 0 ? (<>
                <hr />
                <p>已存在数据库中，重复的人员：</p>
                <PeopleShow array={repeat.value} />
              </>
              ) : null
            }
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