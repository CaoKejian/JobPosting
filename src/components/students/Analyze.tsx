import { defineComponent, ref } from 'vue';
import { AnalyzeList } from './AnalyzeList';
import { TabsLayout } from '../../layouts/TabsLayout';

export const Analyze = defineComponent({
  setup: (props, context) => {
    const tabMap = ['周频率', '擅长方向', '提交习惯', '相似性']
    return () => (
      <TabsLayout component={AnalyzeList} tabMap={tabMap} title='数据分析' />
    )
  }
})

export default Analyze