import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './StatisList.module.scss';
import { My } from '../statis/my';
export const StatisList = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    onMounted(() => {
     
    })
    return () => (<div class={s.wrapper}>
      {
        props.id === '0' ? (
          <My />
        ) : props.id === '1' ? (
          <div>嘿嘿</div>
        ) : props.id === '2' ? (
          <div>呵呵</div>
        ) : props.id === '3' ? (
          <div>你好</div>
        ) : null
      }
    </div>
    )
  }
})

// 此页面为内容页面