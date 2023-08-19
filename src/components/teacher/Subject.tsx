import { PropType, defineComponent, ref } from 'vue';
import s from './Subject.module.scss';
export const Subject = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Subject</div>
    )
  }
})