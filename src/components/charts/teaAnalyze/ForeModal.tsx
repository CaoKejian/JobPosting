import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';
import { http } from '../../../shared/Http';
import { Toast } from 'vant';

export const ForeModal = defineComponent({
  props: {
    refresh: {
      type: Number as PropType<number>,
      default: 0
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const seriesData = ref<{ name: string, value: number }[]>([{
      name: '准确率',
      value: 70
    }, {
      name: '召回率',
      value: 80
    }, {
      name: 'F1分数',
      value: 80,
    }])
    let yName = seriesData.value.map((item) => item.name);
    let barWidth = 14;
    onMounted(() => {
      Toast.loading({
        message: '正在进行模型分析...',
        forbidClick: true,
      })
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      handleStudentModal()
    })
    const handleStudentModal = async () => {
      try {
        const res = await http.get<{ accuracy: number, f1_score: number, recall: number }>('/analyze/train')
        const data = res.data
        seriesData.value[0].value = data.accuracy * 100
        seriesData.value[1].value = data.recall * 100
        seriesData.value[2].value = data.f1_score * 100
        update()
        Toast.clear()
      } catch (err) {
        Toast.clear()
        Toast({ message: '网络异常，此为Mock环境！' })
        const x = parseFloat((Math.random() * 100).toFixed(2))
        const y = parseFloat((Math.random() * 100).toFixed(2))
        const z = parseFloat((2 * (x * y) / (x + y)).toFixed(2))
        seriesData.value =
          [{
            name: '准确率',
            value: x
          }, {
            name: '召回率',
            value: y
          }, {
            name: 'F1分数',
            value: z,
          }]
        update()

      }

    }
    const update = () => {
      chart?.setOption({
        xAxis: {
          splitLine: {
            show: false
          },
          axisLabel: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLine: {
            show: false
          }
        },
        grid: {
          left: 60,
          top: 0,
          right: 20,
          bottom: 0
        },
        yAxis: [{
          inverse: true,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            margin: 10,
            fontSize: 14,
            color: '#386b77'
          },
          data: yName,
        }],
        series: [{
          type: 'bar',
          barWidth,
          legendHoverLink: false,
          symbolRepeat: true,
          silent: true,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [{
                offset: 0,
                color: '#7580f5' // 0% 处的颜色
              }, {
                offset: 1,
                color: '#939bf8' // 100% 处的颜色
              }]
            }
          },
          label: {
            show: true,
            position: ['90%', -20],
            color: '#386b78',
            fontSize: 12,
            formatter: ({ value }: { value: number }) => {
              return value
            }
          },
          data: seriesData.value,
          z: 1,
          animationEasing: 'elasticOut'
        },
        { // 背景
          type: 'pictorialBar',
          animationDuration: 0,
          symbolRepeat: 'fixed',
          symbolMargin: '20%',
          symbol: 'roundRect',
          symbolSize: [6, barWidth],
          itemStyle: {
            color: '#d1daf5',
          },
          data: ["100", "100", "100"],
          z: 0,
          animationEasing: 'elasticOut'
        },
        { //分隔
          type: 'pictorialBar',
          itemStyle: {
            color: '#5764f1'
          },
          symbolRepeat: 'fixed',
          symbolMargin: 4,
          symbol: 'roundRect',
          symbolClip: true,
          symbolSize: [2, barWidth],
          symbolPosition: 'start',
          symbolOffset: [0, 0],
          data: seriesData.value,
          z: 2,
          animationEasing: 'elasticOut'
        }
        ]
      })
    }
    watchEffect(() => {
      if(props.refresh){
        handleStudentModal()
      }
    })
    return () => (
      <div ref={refDiv} class={s.forechart}></div>
    )
  }
})