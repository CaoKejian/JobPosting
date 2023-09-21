import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';

export const HistorySubject = defineComponent({
  props: {
    selectValue: {
      type: String as PropType<string>,
      default: '按班级'
    },
    historyClass: {
      type: Array as PropType<{ bit: number, id: string }[]>,
      default: []
    },
    historySubject: {
      type: Array as PropType<{ bit: number, name: string }[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const subjectData = ref([
      { name: "Vue3", value: 61 },
      { name: "数据挖掘", value: 30 },
      { name: "高数(1)", value: 40 },
      { name: "TypeScript", value: 55 },
      { name: "React", value: 24 },
    ])
    subjectData.value = subjectData.value.sort((a, b) => {
      return a.value - b.value;
    });
    const classData = ref([{ value: 1048, name: '大数据B201' },
    { value: 735, name: '智能B222' },])
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const updateClass = () => {
      chart?.setOption({
        legend: {
          top: '10%'
        },
        tooltip: {
          trigger: 'item'
        },
        grid: {
          left: '10%',
          right: '10%',
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '班级逾期对比',
              type: 'png',
            },
          }
        },
        series: [
          {
            type: 'pie',
            radius: '50%',
            data: classData.value,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      })
    }
    const updateSubject = () => {
      chart?.setOption({
        grid: {
          top: "40",
          left: "0",
          right: "0",
          bottom: "0",
        },
        tooltip: {
          trigger: 'item'
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            restore: { show: true },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '班级逾期对比',
              type: 'png',
            },
          }
        },
        series: [
          {
            type: "pie",
            color: '#d2dbf3',
            silent: true,
            clockwise: true,
            radius: ["0%", "10%"],
            center: ["50%", "50%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [0],
          },
          {
            type: "pie",
            color: '#8E99B3',
            silent: true,
            clockwise: true,
            radius: ["15%", "16%"],
            center: ["50%", "50%"],
            label: {
              show: false,
            },
            labelLine: {
              show: false,
            },
            data: [0],
          },
          {
            stack: "a",
            type: "pie",
            radius: ["30%", "68%"],
            center: ["50%", "50%"],
            silent: true, // 鼠标悬浮效果
            clockwise: true, // 鼠标悬浮效果
            roseType: "area",
            zlevel: 10,
            label: {
              show: true,
              color: '#2f6b77',
              fontSize: 15,
              lineHeight: 20,
              formatter: '{percent|{d}%}\n{name|{b}}',
              rich: {
                percent: {
                  fontSize: 15,
                  color: '#5764f1',
                },
              }
            },
            itemStyle: {
              borderWidth: 3,
            },
            data: subjectData.value
          }
        ]
      })
    }
    const updateSelect = (selectValue: string) => {
      if (chart) {
        chart.dispose();
      }
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      switch (selectValue) {
        case '按班级':
          updateClass()
          break;
        case '按学科':
          updateSubject()
          break;
        default:
          break;
      }
    }
    const handleSubject = () => {
      return props.historySubject.map(item => ({
        name: item.name,
        value: item.bit
      }))
    }
    watchEffect(() => {
      subjectData.value = handleSubject()
      updateSelect(props.selectValue)
    })
    return () => (
      <div ref={refDiv} class={s.subjectClass}></div>
    )
  }
})