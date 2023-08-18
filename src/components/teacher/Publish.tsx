import { PropType, defineComponent, ref } from 'vue';
import s from './Publish.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { MenuBar } from '../../layouts/MenuBar';
export const Publish = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref<boolean>(false)
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '发布作业',
          default: () => <div class={s.content}>
            {
              isShowMenu.value ?
                <MenuBar  name={'teacher'} onClose={() => isShowMenu.value = false} />
                : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})