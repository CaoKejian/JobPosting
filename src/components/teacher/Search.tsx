import { PropType, defineComponent, ref } from 'vue';
import s from './Search.module.scss';
export const Search = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div>Search</div>
    )
  }
})