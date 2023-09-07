import { defineComponent, ref } from 'vue';
import { AnalyzeLayout } from '../../layouts/AnalyzeLayout';
import { AnalyzeList } from './AnalyzeList';

export const Analyze = defineComponent({
  setup: (props, context) => {
    return () => (
      <AnalyzeLayout component={AnalyzeList}/>
    )
  }
})

export default Analyze