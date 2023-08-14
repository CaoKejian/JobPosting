import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './LineChart.module.scss';
import * as echarts from 'echarts';

type dataObj = {
  name: string, value: number
}
export const PieChart = defineComponent({
  props: {
    data: {
      type: Array as PropType<dataObj[]>,
      default: [{
        name: "大数据",
        value: 54
      },
      {
        name: "智能",
        value: 11
      },
      {
        name: "计科",
        value: 20
      }]
    },
  },
  setup: (props, context) => {
    const getArrayValue = (array: dataObj[], key: string) => {
      var key = key || "value";
      var res: dataObj[] = [];
      if (array) {
        array.forEach(function (item: any) {
          res.push(item[key]);
        });
      }
      console.log(res)
      return res;
    }
    const array2obj = (array: any, key: any) => {
      var resObj: any = {};
      for (var i = 0; i < array.length; i++) {
        resObj[array[i][key]] = array[i];
      }
      return resObj;
    }
    const getData= (data: any) => {
      var res: any = {
        series: [],
        yAxis: []
      };
      for (let i = 0; i < data.length; i++) {
        res.series.push({
          name: '',
          type: 'pie',
          clockWise: false, //顺时加载
          hoverAnimation: false, //鼠标移入变大
          radius: [60 - i * 15 + '%', 55 - i * 15 + '%'],
          startAngle: -90 * i, //起始角度
          center: ["35%", "50%"],
          label: {
            show: true,
            lineHeight: 40,
            formatter: '{b}\n\n{d}%',
            padding: [50, -60, 25, -60],
            textStyle: {
              fontSize: 12,
              color: "#386b78",
            }
          },
          labelLine: {
            show: true,
            length: 50,
            length2: 60
          },
          itemStyle: {
            label: {
              show: true,
            },
            labelLine: {
              show: true
            },
            borderWidth: 5,
          },
          data: [{
            value: data[i].value,
            name: data[i].name
          }, {
            value: sumValue - data[i].value,
            name: '',
            itemStyle: {
              color: "rgba(0,0,0,0)",
              borderWidth: 0
            },
            label: {
              show: false
            },
            tooltip: {
              show: false
            },
            hoverAnimation: false
          }]
        });
        res.yAxis.push((data[i].value / sumValue * 100).toFixed(2) + "%");
      }
      return res;
    }
    const arrName = getArrayValue(props.data, "name");
    const arrValue = getArrayValue(props.data, "value");
    const sumValue = eval(arrValue.join('+'));
    const objData = array2obj(props.data, "name");//alert(JSON.stringify(objData))
    const optionData = getData(props.data);
    onMounted(() => {
      if (refDiv.value === undefined) { return }
      chart = echarts.init(refDiv.value)
      chart?.setOption({
        grid: {
          left: '8%',
          top: '6%',
          right: '0%',
          bottom: '0%',
          containLabel: true
        },
        backgroundColor: '#fff',
        legend: {
          show: true,
          icon: "rect", //  这个字段控制形状  类型包括 circle，rect ，roundRect，triangle，diamond，pin，arrow，none
          top: '20%',
          right: "2%",
          data: arrName,
          itemWidth: 17,
          itemHeight: 8,
          padding: [0, 4],
          itemGap: 10,
          orient: 'vertical',
          formatter: function (name: string) {
            return "{title|" + name + "}{value|" + (objData[name].value) + "}{title|份}"
          },
          textStyle: {
            rich: {
              title: {
                fontSize: 14,
                lineHeight: 20,
                color: "#"
              },
              value: {
                fontSize: 14,
                lineHeight: 20,
                color: "#386b78"
              }
            }
          },
        },
        tooltip: {
          show: true,
          trigger: "item",
          formatter: "{a}<br>{b}:{c}({d}%)"
        },
        color: ['#fc05f4', '#33d7d9', '#703bfd', '#de4841', '#5764f1'],
        xAxis: [{
          show: false
        }],
        series: optionData.series
      })
    })
    const refDiv = ref<HTMLDivElement>()
    let chart: echarts.ECharts | undefined = undefined
    return () => (
      <div ref={refDiv} class={s.piechart}></div>
    )
  }
})