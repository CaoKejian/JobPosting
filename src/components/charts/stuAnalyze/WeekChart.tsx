import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const WeekChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<number[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const updateData = (data: number[]) => {
      chart?.setOption({
        grid: {
          left: '10%',
          top: '12%',
          right: '10%',
          bottom: '10%',
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '提交周频率',
              type: 'png',
            },
          }
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
          type: 'value',
          axisLabel: {
            textStyle: {
              color: '#446a76',
              fontSize: 12
            }
          },
          splitLine: {
            show: true,
            lineStyle: {
              color: '#979797',
              type: [5, 10],
            },
          },
        },
        series: [
          {
            name: '提交数',
            type: 'line',
            symbol: 'circle',
            symbolSize: 14,
            itemStyle: {
              shadowColor: '#fff',
              shadowBlur: 15,
              borderColor: '#aaa',
            },
            color: '#1EC5EA',
            data: data,
            markLine: {
              symbol: ['none', 'none'],
              data: [
                {
                  name: '上限控制',
                  yAxis: 40,
                  lineStyle: { type: 'solid', color: '#EF8181', width: 1 } // 样式： 线型、颜色、线宽
                },
                {
                  name: '平均数',
                  yAxis: 25,
                  lineStyle: { type: 'solid', color: '#33CCCC', width: 1 } // 样式： 线型、颜色、线宽
                },
                {
                  name: '下线控制',
                  yAxis: 10,
                  lineStyle: { type: 'solid', color: '#FFDF8E', width: 1 } // 样式： 线型、颜色、线宽
                },
              ]
            }
          },
        ]
      })
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    watchEffect(() => {
      updateData(props.data)
    })
    return () => (
      <div ref={refDiv} class={s.piechart}></div>
    )
  }
})