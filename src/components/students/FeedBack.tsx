import { PropType, defineComponent, ref } from 'vue';
import s from './FeedBack.module.scss';
export const FeedBack = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>用户反馈</div>
    )
  }
})