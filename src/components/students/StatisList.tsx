import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './StatisList.module.scss';
import { MyItem } from '../statis/MyItem';
import { Class } from '../statis/Class';
import { AllSchool } from '../statis/AllScholl';
export const StatisList = defineComponent({
  props: {
    id: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    onMounted(() => {
     
    })
    return () => (<div class={s.wrapper}>
      {
        props.id === '0' ? (
          <MyItem />
        ) : props.id === '1' ? (
          <Class />
        ) : props.id === '2' ? (
          <AllSchool />
        ) : props.id === '3' ? (
          <div>你好</div>
        ) : null
      }
    </div>
    )
  }
})

// 此页面为内容页面