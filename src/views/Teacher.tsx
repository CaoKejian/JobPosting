import { PropType, defineComponent, ref } from 'vue';
import { RouterView } from 'vue-router';
export const Teacher = defineComponent({
  setup: (props, context) => {
    return () => (
      <RouterView />
    )
  }
})

export default Teacher