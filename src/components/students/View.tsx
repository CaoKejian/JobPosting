import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './View.module.scss';
import { RouteParams, useRoute } from 'vue-router';
import { http } from '../../shared/Http';
import { WorkObj } from '../../vite-env';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
export const View = defineComponent({
  setup: (props, context) => {
    const route = useRoute()
    const workInfo = ref<WorkObj[]>([])
    const isShowMenu = ref<boolean>(false)
    const fetchData = async (id: RouteParams) => {
      try {
        const data = await http.get<WorkObj[]>('/work/otherwork', id, {
          _autoLoading: true
        })
        workInfo.value = data.data
      } catch (error) {
        console.log(error);
      }
    }
    onMounted(() => {
      console.log(route.params);
      fetchData(route.params)
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='return' />,
          title:() => '作业信息',
          default: () => <div class={s.wrapper}>
            
          </div>
        }  
      }</MainLayout>
    )
  }
})

export default View