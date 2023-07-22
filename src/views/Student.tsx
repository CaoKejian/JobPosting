import { PropType, defineComponent, ref } from 'vue';
import { RouterView } from 'vue-router';
export const Student = defineComponent({
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

export default Student