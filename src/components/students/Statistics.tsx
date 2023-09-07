import { defineComponent } from 'vue';
import { TabsLayout } from '../../layouts/TabsLayout';
import { StatisList } from './StatisList';
export const Statistics = defineComponent({
  setup: (props, context) => {
    return () => (
      <TabsLayout component={StatisList} title='作业统计'/>
    )
  }
})

export default Statistics