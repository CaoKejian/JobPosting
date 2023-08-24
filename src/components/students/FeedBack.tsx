import { PropType, defineComponent, ref } from 'vue';
import s from './FeedBack.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { getAssetsFile } from '../../config/imgUtil';
export const FeedBack = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu'/>,
          title:() => '反馈系统',
          default:() => <div class={s.wrapper}>
            <Quote name="您的反馈是我最大的动力！"/>
            <div class={s.icon}>
              <svg class={s.svg}><use xlinkHref='#feedback'></use></svg>
            </div>
          </div>
        }
      }</MainLayout>
    )
  }
})