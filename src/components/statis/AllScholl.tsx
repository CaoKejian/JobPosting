import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './AllSchool.module.scss';
import { LineChart } from '../charts/statis/LineChart';
export const AllSchool = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const LineData = ref([6647, 7473, 8190, 8488, 9491])
    onMounted(() => {
      // 请求
      
    })
    return () => (
      <div class={s.content}>
        <p>作业发布排名</p>
        <LineChart data={LineData.value}/>
      </div>
    )
  }
})