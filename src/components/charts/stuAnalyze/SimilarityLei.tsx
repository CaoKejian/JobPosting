import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

interface SelectType {
  name: string, value: number, max: number
}
export const SimilarityLei = defineComponent({
  props: {
    slelectData: {
      type: Array as PropType<SelectType[]>,
      default: []
    },
    selectValue: {
      type: String as PropType<string>,
      default: ''
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const dataValue = ref<number[]>([])
    const data = ref<SelectType[]>([])
    const findValue = (name: string) => {
      const a = props.slelectData.find(item => {
        return item.name === name
      })
      return a?.value + '%'
    }
    const handleValue = () => {
      if (dataValue.value.length >= props.slelectData.length) {
        dataValue.value = []
      }
      data.value.map(item => {
        dataValue.value.push(item.value)
      })
    }
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = (selectValue: string) => {
      chart?.setOption({
        title: {
          text: [`{b|${selectValue}}`].join(''),
          bottom: 'center',
          left: 'center',
          textStyle: {
            rich: {
              b: {
                fontSize: 18,
                color: '#446a76',
                lineHeight: 40,
              },
            },
          },
        },
        toolbox: {
          feature: {
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学科之间的相关性',
              type: 'png',
            },
          }
        },
        radar: {
          radius: '60%',
          axisLabel: {
            interval: 10, // 设置刻度间隔
          },
          axisName: {
            formatter: (value: string) => {
              return '{a|' + findValue(value) + '}\n' + '{b|' + value + '}';
            },
            padding: [0, 20, 5, 20],
            rich: {
              a: {
                align: 'center',
                color: '#7580f5',
                fontWeight: 500,
                height: 30,
                fontSize: 18,
              },
              b: {
                align: 'center',
                color: '#000',
                fontSize: 14,
              },
            },
          },
          axisNameGap: 2,
          indicator: props.slelectData,
          splitArea: {
            show: false,
          },
          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              color: 'rgba(144, 155, 244,5)', // 网格分割线颜色
            },
          },
        },
        series: [
          {
            type: 'radar',
            symbolSize: 3,
            symbol: 'circle',
            data: [dataValue.value],
            areaStyle: {
              color: '#d4dbf2',
              opacity: 0.5,
            },
            lineStyle: {
              color: new echarts.graphic.LinearGradient(
                0,
                0,
                0,
                1,
                [
                  {
                    offset: 0,
                    color: '#5064ec',
                  },
                  {
                    offset: 1,
                    color: '#7180f1',
                  },
                ],
                false
              ),
              width: 3,
            },
          },
        ],
      })
    }
    watchEffect(() => {
      data.value = props.slelectData
      handleValue()
      update(props.selectValue)
    })

    return () => (
      <div ref={refDiv} class={s.averagechart}></div>
    )
  }
})