import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Statistics.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
export const Statistics = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const isBoolean = reactive({
      isShowMenu: false
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isBoolean.isShowMenu = true}/>,
          title: () => '作业统计',
          default:() => <div class={s.wrapper}>
            123
            {
              isBoolean.isShowMenu ?
              <MenuBar onClose={() => isBoolean.isShowMenu = false} />
              : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})

export default Statistics