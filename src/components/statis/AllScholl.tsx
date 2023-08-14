import { PropType, defineComponent, ref } from 'vue';
import s from './AllSchool.module.scss';
import { LineChart } from '../charts/statis/LineChart';
export const AllSchool = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    return () => (
      <div class={s.content}>
        <p>作业发布排名</p>
        <LineChart />
      </div>
    )
  }
})