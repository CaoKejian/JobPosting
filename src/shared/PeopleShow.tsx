import { PropType, defineComponent } from 'vue';
import s from './PeopleShow.module.scss';
export const PeopleShow = defineComponent({
  props: {
    array: {
      type: Array as PropType<{ stuId: number, name?:string, classId?: number, isSubmit?: boolean }[]>,
      default: []
    }
  },
  setup: (props, context) => {
    return () => (<div class={s.fake}>
      {props.array.map(item => {
        return <span class={s.item} key={item.stuId}>
          {item.isSubmit ? <svg class={s.svg}><use xlinkHref='#isSubmit'></use></svg> : null }
          {item.name}
        </span>
      })}
    </div>
    )
  }
})