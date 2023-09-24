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
  searchValue: string,
  peopleData: [],
  paginData: { currentPage: string, perPage: number, total: number, totalPages: number }
}
export const Auth = defineComponent({
  setup: (props, context) => {
    const useData = reactive<UseData>({
      isShowMenu: false,
      page: 1,
      searchValue: '',
      peopleData: [],
      paginData: { currentPage: '1', perPage: 1, total: 1, totalPages: 1 }
    })
    const { isShowMenu, page, searchValue, peopleData, paginData } = toRefs(useData)
    const fetchUserData = async () => {
      const response = await http.get<any>('/user/all', { page: page.value }, { _autoLoading: true })
      peopleData.value = response.data.data
      paginData.value = response.data.pagination
    }
    const onGetdata = (obj: { n: number, type: string }) => {
      const { n, type } = obj
      switch (type) {
        case 'default':
          page.value = n
          fetchUserData()
          break;
        case 'classId':
          fetchSearchValueData("classId", searchValue.value, n)
          break
        default:
          break;
      }
    }
    const fetchSearchValueData = async (type: string, value: string, page: number = 1) => {
      const res = await http.get<any>('/user/type/search', { type, value, page }, { _autoLoading: true })
      peopleData.value = res.data.data
      paginData.value = res.data.pagination
    }
    const onSearch = (obj: { type: string, value: string }) => {
      const { type, value } = obj
      searchValue.value = value
      switch (type) {
        case '姓名':
          fetchSearchValueData("name", value)
          break;
        case '学号':
          fetchSearchValueData("stuId", value)
          break;
        case '班级':
          fetchSearchValueData("classId", value, 1)
          break;
        case '总裁':
          fetchSearchValueData("Auth", value)
          break;
        case '超级管理员':
          fetchSearchValueData("Root", value)
          break;
        default:
          break;
      }
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
export default Auth
