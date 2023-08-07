import { PropType, defineComponent, ref } from 'vue';
import s from './Loading.module.scss';
export const Loading = defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  setup: (props, context) => {
    return () => (<>
      {
        !props.visible ?
          <div class={s.svgWrapper}><svg class={s.loading}><use xlinkHref='#loading'></use></svg></div>
          : null
      }
    </>
    )
  }
})