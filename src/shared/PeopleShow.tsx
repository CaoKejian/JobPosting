import { PropType, defineComponent, ref, watch, watchEffect } from 'vue';
import s from './PeopleShow.module.scss';
import { stuIdMapFunction } from '../config/NameMap';
export const PeopleShow = defineComponent({
  props: {
    array: {
      type: Array as PropType<{ stuId: number, classId: number, isSubmit?: boolean }[]>,
      default: []
    }
  },
  setup: (props, context) => {
    return () => (<div class={s.fake}>
      {props.array.map(item => {
        return <span class={s.item} key={item.stuId}>
          {item.isSubmit ? <svg class={s.svg}><use xlinkHref='#isSubmit'></use></svg> : null }
          {stuIdMapFunction(item.stuId)}
        </span>
      })}
    </div>
    )
  }
})