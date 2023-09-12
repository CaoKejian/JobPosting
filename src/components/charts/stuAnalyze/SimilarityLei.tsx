import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from '../statis/LineChart.module.scss';
import * as echarts from 'echarts';

export const SimilarityLei = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const selectValue = ref('数据挖掘')
    const dataValue = ref([37, 46, 13.33, 51])
    const mapTransitionFn = [
      { name: 'TypeScript', value: 37, max: 70 },
      { name: 'Vue3', value: 46, max: 70 },
      { name: 'React', value: 13.33, max: 70 },
      { name: '高数(1)', value: 51, max: 70 },
    ]
    const findValue = (name: string) => {
      const a = mapTransitionFn.find(item => {
        return item.name === name
      })
      return a?.value + '%'
    }
    const dataArr = [
      {
        value: dataValue.value,
        name: '',
        itemStyle: {
          lineStyle: {
            color: '#17E7FF',
          },
          shadowColor: '#17E7FF',
          shadowBlur: 5,
        },
      },
    ];
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      update()
    })
    const update = () => {
      chart?.setOption({
        title: {
          text: [`{b|${selectValue.value}}`].join(''),
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
          indicator: mapTransitionFn,
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
            data: dataArr,
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
    return () => (
      <div ref={refDiv} class={s.averagechart}></div>
    )
  }
})