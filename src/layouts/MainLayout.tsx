import { PropType, defineComponent, ref } from 'vue';
import s from './MainLayout.module.scss';
export const MainLayout = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.wrapper}>
        <div class={s.main}>
          <div class={s.title}>
            {context.slots.title?.()}
          </div>
        </div>
        <div class={s.body}>
          {context.slots.default?.()}
        </div>
        <div class={s.footer}>
          <div class={s.title}>
            {context.slots.fTitle?.()}
          </div>
        </div>
      </div>
    )
  }
})