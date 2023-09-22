import { PropType, defineComponent, reactive, ref } from 'vue';
import { Tab, Tabs } from '../shared/Tabs';
import { BackIcon } from '../shared/BackIcon';
import { MainLayout } from './MainLayout';
import { MenuBar } from './MenuBar';

const demo = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
})
export const TabsLayout = defineComponent({
  props: {
    component: {
      type: Object as PropType<typeof demo>,
      required: true
    },
    tabMap: {
      type: Array as PropType<string[]>,
      default: ['我的','班级','全校的','自定义']
    },
    title:{
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const {tabMap, title} = props
    const isBoolean = reactive({
      isShowMenu: false
    })
    const refSelected = ref(tabMap[1])
    return () => (
       <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isBoolean.isShowMenu = true}/>,
          title: () => title,
          default:() => <><div>
            <Tabs v-model:selected={refSelected.value}
              rerenderOnSelect={true}>
              <Tab value={tabMap[0]} name={tabMap[0]}>
                <props.component
                  id={'0'}
                >
                </props.component>
              </Tab>
              <Tab value={tabMap[1]} name={tabMap[1]}>
                <props.component
                    id={'1'}
                  >
                </props.component>
              </Tab>
              <Tab value={tabMap[2]} name={tabMap[2]}>
                <props.component
                    id={'2'}
                  >
                </props.component>
              </Tab>
              <Tab value={tabMap[3]} name={tabMap[3]}>
                <props.component
                    id={'3'}
                  >
                </props.component>
              </Tab>
            </Tabs> 
          </div>
          {
            isBoolean.isShowMenu ?
            <MenuBar name={tabMap[0]!=='我的' ? 'teacher': 'student'} onClose={() => isBoolean.isShowMenu = false} />
            : null
          }</>
        }
      }</MainLayout>
     
    )
  }
})