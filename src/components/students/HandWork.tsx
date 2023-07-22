import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './HandWork.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Model } from '../../shared/Model';
import { FormItem } from '../../shared/Form';
export const HandWork = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(true)
    const classId = ref<string>('')
    const isHaveClass = ref<boolean>(false)
    const onChangeModel = (value1:string,value2:number) => {
      if(value2===1){
        console.log('你正在搜索班级群：',classId.value);
        isHaveClass.value = true
        localStorage.setItem('classID', classId.value)
      }
    }
    onMounted(() => {
      const classID= localStorage.getItem('classID')
      isShowVisible.value = classID ? false : true
      isHaveClass.value = classID ? true : false
    })
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon />,
          title: () => '学生界面',
          default: () => <div>
            {isHaveClass.value ?
            <div>hahaha </div>
            :
            !isShowVisible.value ?
              <div class={s.none}><span>未找到相关班级信息，联系一下学委呀</span>
              <svg class={s.svg}><use xlinkHref='#cry'></use></svg>
            </div>:null
          }
            {isShowVisible.value ?
              <Model v-model:modelVisible={isShowVisible.value}
                onUpdate:modelVisible={onChangeModel}
              >{
                {
                  title:() => '请填写班级码',
                  content:() => <div>
                    <FormItem label='进班码' type='text' v-model={classId.value}
                  placeholder='六位数字' ></FormItem>
                  </div>,
                }
              }</Model> : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})
