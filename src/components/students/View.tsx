import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './View.module.scss';
import { useRoute } from 'vue-router';
export const View = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const route = useRoute()
    onMounted(() => {
      console.log(route.params);
      
    })
    return () => (
      <div>View</div>
    )
  }
})

export default View