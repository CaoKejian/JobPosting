import { PropType, defineComponent, ref, watch } from 'vue';
import s from './WeekFrequency.module.scss';
import { Quote } from '../../shared/Quote';
import { HistoryBit } from '../charts/teaAnalyze/HistoryBit';
import { HistorySubject } from '../charts/teaAnalyze/HistorySubject';
import { FormItem } from '../../shared/Form';
import { HistoryQuency } from '../charts/teaAnalyze/HistoryQuency';
export const History = defineComponent({
  
  setup: (props, context) => {
    const selectData = ref([
      {value:'班级', text:'按班级'},
      {value:'学科', text:'按学科'},
    ])
    const selectValue = ref(selectData.value[1].text)
    watch(() => selectValue.value, (n) => {
    })
    return () => (
      <div class={s.wrapper}>
        <Quote name='个人提交历史监控(分组聚合)'/>
        <HistoryBit />
        <Quote name='班级/学科提交历史监控(聚类分析)' />
        <FormItem label='' type='select'
        v-model={selectValue.value}
        options={selectData.value}
        ></FormItem>
        <HistorySubject selectValue={selectValue.value}/>
        <Quote name='逾期次数趋势追踪（时间序列分析）'/>
        <HistoryQuency />
      </div>
    )
  }
})