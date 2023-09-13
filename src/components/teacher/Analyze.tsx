import { PropType, defineComponent, ref } from 'vue';
import s from './Analyze.module.scss';
import { TabsLayout } from '../../layouts/TabsLayout';
import { AnalyzeList } from '../teacher/AnalyzeList';
export const Analyze = defineComponent({
  setup: (props, context) => {
    const tabMap = ['监控', '难度评估', '分析提交', '模型预测']
    return () => (
      <TabsLayout component={AnalyzeList} tabMap={tabMap} title='数据分析' />
    )
  }
})

export default Analyze
