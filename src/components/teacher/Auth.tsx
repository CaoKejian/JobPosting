import { PropType, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import s from './Auth.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Quote } from '../../shared/Quote';
import { Table } from '../../shared/Table';
import { http } from '../../shared/Http';
import { User } from '../../vite-env';
export const Auth = defineComponent({
  setup: (props, context) => {
    const useData = reactive({
      isShowMenu: false,
      page: 1,
      peopleData: []
    })
    const { isShowMenu, page, peopleData } = toRefs(useData)
    const fetchUserData = async () => {
      const response = await http.get<any>('/user/all', { page: page.value }, { _autoLoading: true })
      peopleData.value = response.data.data
    }
    const onGetdata = (n: string) => {
      console.log(n)
    }
    onMounted(() => {
      fetchUserData()
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '权限配置',
          default: () => <div class={s.wrapper}>
            <Quote name='选择查询方向' />
            <div class={s.table}>
              <Table data={peopleData.value} onUpdate:value={onGetdata} />
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