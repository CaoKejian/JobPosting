import { PropType, defineComponent } from 'vue';
import { RouterView } from 'vue-router';
export const Error = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <RouterView />
    )
  }
})

export default Error