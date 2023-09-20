import { PropType, defineComponent, reactive, ref, toRefs } from 'vue';
import s from './Handuser.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { MenuBar } from '../../layouts/MenuBar';
import { Button } from '../../shared/Button';
export const Handuser = defineComponent({
  setup: (props, context) => {
    const useData = reactive({
      isShowMenu: false,
      status: '正在上传...'
    })
    const { isShowMenu, status } = toRefs(useData)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '上传用户',
          default: () => <div class={s.wrapper}>
            <Quote name='上传csv文件，需至少姓名、学号两列数据' />
            <div class={s.upload}>
              <van-uploader>
                <Button>上传表单文件</Button>
              </van-uploader>
            </div>
            <div class={s.status}><svg class={s.svg}><use xlinkHref='#isHandinfo'></use></svg>{status.value}</div>
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