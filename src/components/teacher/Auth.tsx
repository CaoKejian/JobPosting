import { PropType, defineComponent, reactive, ref, toRefs } from 'vue';
import s from './Auth.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Quote } from '../../shared/Quote';
import { Table } from '../../shared/Table';
export const Auth = defineComponent({
  setup: (props, context) => {
    const useData = reactive({
      isShowMenu: false
    })
    const { isShowMenu } = toRefs(useData)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '权限配置',
          default: () => <div class={s.wrapper}>
            <Quote name='选择查询方向'/>
            <div class={s.table}>
              <Table />
            </div>
            {
              isShowMenu.value ?
                <MenuBar name='teacher' onClose={() => isShowMenu.value = false} /> : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})