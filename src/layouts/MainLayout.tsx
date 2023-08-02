import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import s from './MainLayout.module.scss';
export const MainLayout = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  emits:['update:value'],
  setup: (props, context) => {
    const body = ref()
    const handleBodyScroll = () => {
      const bodyElement = body.value;
      if (bodyElement) {
        const scrollTop = bodyElement.scrollTop;
        const scrollHeight = bodyElement.scrollHeight;
        const clientHeight = bodyElement.clientHeight;
        if (scrollTop + clientHeight >= scrollHeight) {
          context.emit('update:value',1)
        }
      }
    };
    onMounted(() => {
        if (body.value) {
          // 添加滚动事件监听
          body.value.addEventListener('scroll', handleBodyScroll);
        }
    })
    return () => (
      <div class={s.wrapper}>
        <div class={s.main}>
          <div class={s.title}>
            <span class={s.icon}>
              {context.slots.icon?.()}
            </span>
            <span>
              {context.slots.title?.()}
            </span>
          </div>
        </div>
        <div class={s.body} ref={body}>
          {context.slots.default?.()}
        </div>
        {
          context.slots.fTitle ?
            <div class={s.footer}>
              <div class={s.title}>
                {context.slots.fTitle()}
              </div>
            </div> :
            null
        }

      </div>
    )
  }
})