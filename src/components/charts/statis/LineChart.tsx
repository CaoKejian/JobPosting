import { PropType, defineComponent, onMounted, ref, watch } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';

let axisData = ['大数据', '智能', '计科', '软工', '互联网']
let seriesData = [6647, 7473, 8190, 8488, 9491]
let topLableSize = 14
let barWidth = 18

export const LineChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<any>
    }
  },
  setup: (props, context) => {
    const seriesData = ref<number[]>([6647, 7473, 8190, 8488, 9491])
    onMounted(async () => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      updateChart(seriesData.value)
      randomData()
    })
    const randomData = () => {
      seriesData.value = seriesData.value.map(() => Math.floor(Math.random() * 10000));
    }
    watch(() => seriesData.value, () => {
      setInterval(() => {
        randomData()
        chart?.setOption({
          series: [{
            data: seriesData.value
          }]
        });
      },2000)
    })
    const updateChart = (data: number[]) => {
      chart?.setOption({
        backgroundColor: '#fff',
        grid: {
          left: '2%',
          top: '2%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        xAxis: [{
          show: false,
        }],
        yAxis: [{
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          offset: '7',
          align: 'left',
          axisLabel: {
            interval: 0,
            color: '#ffffff',
            fontSize: '12',
            fontWeight: 'bold',
            fontFamily: 'siyuan',
            formatter: function (value: string, index: number) {
              return '{rank' + '|' + 'Top' + (1 + index) + '}{title|' + value + '}'
            },
            rich: {
              rank: {
                color: '#ecbc41',
                fontSize: topLableSize,
                fontWeight: 'bold',
                fontFamily: 'siyuan',
              },
              title: {
                color: '#386b78',
                align: 'right',
                width: 70,
                fontSize: topLableSize,
                fontWeight: 'bold',
                fontFamily: 'siyuan',
              }
            }
          },
          data: axisData
        }, {
          inverse: true,
          axisTick: 'none',
          axisLine: 'none',
          offset: '27',
          textStyle: {
            color: '#ffffff',
            fontSize: '0',
          },
          data: [10, 9, 8, 7, 6]
        },],
        series: [{
          name: '条',
          type: 'bar',
          yAxisIndex: 0,
          //柱状图自动排序，排序自动让Y轴名字跟着数据动
          realtimeSort: true,
          data: data,
          barWidth: topLableSize,
          barGap: '10%',
          barCategoryGap: '20%',
          itemStyle: {
            borderRadius: [0, 30, 30, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [{
              offset: 0,
              color: '#5764f1'
            }, {
              offset: 1,
              color: '#939bf8'
            }]),
          },
          z: 2
        },
        ]
      })
    }
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    return () => (
      <div ref={refDiv} class={s.chart}></div>
    )
  }
})