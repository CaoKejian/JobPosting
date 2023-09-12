import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const SimilarityChart = defineComponent({
  props: {
    class: {
      type: String as PropType<string>,
      default: '大数据B201'
    },
    staticData: {
      type: Object as PropType<{}>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const handleData = (data: any) => {
      const result = Object.keys(data).map((key: any) => ({
        name: key,
        children: Object.keys(data[key]).map((subKey: any) => ({
          name: subKey,
          value: data[key][subKey] / 100
        }))
      }));
      const obj: { name: string, children: any[] } = { name: '', children: [] }
      obj.name = props.class
      obj.children = result
      return obj
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update()
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          trigger: 'item',
          triggerOn: 'click'
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学科之间的相关性(矩阵分析)',
              type: 'png',
            },
          }
        },
        series: [
          {
            type: 'tree',
            data: [handleData(props.staticData)],
            top: '1%',
            left: '25%',
            bottom: '1%',
            right: '25%',
            symbolSize: 7,
            initialTreeDepth: 1,
            label: {
              normal: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'right',
                fontSize: 15
              }
            },
            leaves: {
              label: {
                normal: {
                  position: 'right',
                  verticalAlign: 'middle',
                  align: 'left'
                }
              }
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750
          }
        ]
      });
    }
    watchEffect(() => {
      handleData(props.staticData)
      update()
    })
    return () => (
      <div ref={refDiv} class={s.averagechart}></div>
    )
  }
})