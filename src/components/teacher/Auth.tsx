import { PropType, defineComponent, onMounted, reactive, ref, toRefs } from 'vue';
import s from './Auth.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
import { Quote } from '../../shared/Quote';
import { Table } from '../../shared/Table';
import { http } from '../../shared/Http';
interface UseData {
  isShowMenu: boolean,
  page: number,
  peopleData: [],
  paginData: { currentPage: string, perPage: number, total: number, totalPages: number }
}
export const Auth = defineComponent({
  setup: (props, context) => {
    const useData = reactive<UseData>({
      isShowMenu: false,
      page: 1,
      peopleData: [],
      paginData: { currentPage: '1', perPage: 1, total: 1, totalPages: 1 }
    })
    const { isShowMenu, page, peopleData, paginData } = toRefs(useData)
    const fetchUserData = async () => {
      const response = await http.get<any>('/user/all', { page: page.value }, { _autoLoading: true })
      peopleData.value = response.data.data
      paginData.value = response.data.pagination
    }
    const onGetdata = (n: number) => {
      page.value = n
      fetchUserData()
    }
    const onSearch = (n: string) => {
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
              <Table data={peopleData.value} onUpdate: value={onGetdata}
                onSearch: value={onSearch} onRefresh: value={fetchUserData}
                pagination={paginData.value}
              />
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