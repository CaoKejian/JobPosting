import { PropType, defineComponent, onMounted, ref, watchEffect } from 'vue';
import s from './teacherChart.module.scss';
import * as echarts from 'echarts';

export const HistoryBit = defineComponent({
  props: {
    historySelf: {
      type: Array as PropType<{ name: string, lateCounts: number, notlateCounts: number, bit: number }[]>,
      default: []
    }
  },
  setup: (props, context) => {
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    const inTime = ref<number[]>([])
    const outTime = ref<number[]>([])
    const averageBit = ref<number[]>([])
    const xData = ref<string[]>([])
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
    })
    const update = () => {
      chart?.setOption({
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
            textStyle: {
              color: "#fff",
            },
          },
        },
        grid: {
          borderWidth: 0,
          top: 60,
          bottom: 95,
          textStyle: {
            color: "#fff",
          },
        },
        toolbox: {
          feature: {
            dataView: { show: true, readOnly: false },
            saveAsImage: {
              show: true,
              title: '下载图片',
              name: '学生逾期与否占比（聚类分析）',
              type: 'png',
            },
          }
        },
        legend: {
          x: "1%",
          top: "2%",
          textStyle: {
            color: "#000",
          },
          data: ["逾期", "按期"],
        },
        calculable: true,
        xAxis: [
          {
            type: "category",
            axisLine: {
              lineStyle: {
                color: "#457a84",
              },
            },
            splitLine: {
              show: false,
            },
            axisTick: {
              show: false,
            },
            splitArea: {
              show: false,
            },
            axisLabel: {
              interval: 0,
            },
            data: xData.value,
          },
        ],
        yAxis: [
          {
            type: "value",
            splitLine: {
              show: false,
            },
            axisLine: {
              lineStyle: {
                color: "#457a84",
              },
            },
            axisTick: {
              show: false,
            },
            axisLabel: {
              interval: 0,
              show: false
            },
            splitArea: {
              show: false,
            },
          },
        ],
        dataZoom: [
          {
            show: true,
            height: 30,
            xAxisIndex: [0],
            bottom: 30,
            start: 10,
            end: 80,
            handleIcon:
              "path://M306.1,413c0,2.2-1.8,4-4,4h-59.8c-2.2,0-4-1.8-4-4V200.8c0-2.2,1.8-4,4-4h59.8c2.2,0,4,1.8,4,4V413z",
            handleSize: "110%",
            handleStyle: {
              color: "#d3dee5",
            },
            textStyle: {
              color: "#fff",
            },
            borderColor: "#90979c",
          },
          {
            type: "inside",
            show: true,
            height: 15,
            start: 1,
            end: 35,
          },
        ],
        series: [
          {
            name: "按期",
            type: "bar",
            stack: "总量",
            barMaxWidth: 35,
            barGap: "10%",
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: "#becce9" }, // 起始颜色
                { offset: 1, color: "#e3e8f2" }, // 结束颜色
              ]),
            },
            label: {
              show: true,
              color: "#000",
              position: "inside",
              formatter: function (p: { value: number }) {
                return p.value > 0 ? p.value : "";
              },
            },
            data: inTime.value,
          },

          {
            name: "逾期",
            type: "bar",
            stack: "总量",
            itemStyle: {
              color: "#4d70c2",
              borderRadius: [4, 4, 0, 0],
            },
            label: {
              color: '#afc5cb',
              show: true,
              position: "inside",
              formatter: function (p: { value: number }) {
                return p.value > 0 ? p.value : "";
              },
            },
            data: outTime.value,
          },
          {
            name: "平均",
            type: "line",
            symbolSize: 10,
            symbol: "circle",
            itemStyle: {
              color: "#93a1c9",
              borderRadius: 0,
            },
            data: averageBit.value,
          },
        ],
      })
    }
    const handleXData = async () => {
      return props.historySelf.map((item) => {
        xData.value.push(item.name)
        inTime.value.push(item.notlateCounts)
        outTime.value.push(item.lateCounts)
        averageBit.value.push(item.bit)
      })
    }
    watchEffect(() => {
      handleXData()
      update()
    })
    return () => (
      <div ref={refDiv} class={s.chart}></div>
    )
  }
})