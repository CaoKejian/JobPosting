import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Table.module.scss';
import { Form, FormItem } from './Form';
import { ClassSelectItem, User } from '../vite-env';
import { throttle } from './Throttle';
export const Table = defineComponent({
  props: {
    data: {
      type: Array as PropType<User[]>
    },
    pagination: {
      type: Object as PropType<{ currentPage: string, perPage: number, total: number, totalPages: number }>
    }
  },
  emits: ['update:value'],
  setup: (props, context) => {
    const selectData = ref<ClassSelectItem[]>([
      { value: '1', text: '姓名' },
      { value: '2', text: '学号' },
      { value: '3', text: '班级' },
      { value: '4', text: '学委' },
      { value: '5', text: '超级管理员' },
    ])
    const searchValue = ref('')
    const selectValue = ref(selectData.value[0].text)
    const tTitle = ['姓名', '学号', '邮箱', '班级', '操作']
    const getData = throttle((n: string) => {
      context.emit('update:value', n)
    },1000)
    const onSearch = () => {

    }
    return () => (
      <div class={s.wrapper}>
        <Form>
          <FormItem label=''
            type='select'
            v-model={selectValue.value}
            options={selectData.value}
          ></FormItem>
          <FormItem label=''
            v-model={searchValue.value}
            type='search'
            placeholder='输入查询内容'
            onClick={onSearch}
          >
          </FormItem>
        </Form>
        <div class={s.title}>
          <div class={s.title_list}>
            {
              tTitle.map(item => {
                return <div class={s.word}>
                  {item}
                </div>
              })}
          </div>
        </div>
        <div class={s.list}>
          <div class={s.list_list}>
            {
              props.data?.map(item => {
                return <div class={s.item} key={item.name}>
                  <ul>
                    <li style={{ color: (item.isRoot ? '#5764f1' : (item.isAuth ? '#386b78' : '#000')) }}>{item.name}</li>
                    <li>{item.stuId}</li>
                    <li>{item.email}</li>
                    <li>{item.classId}</li>
                    <li class={s.set}>设置</li>
                  </ul>
                </div>
              })}
          </div>
        </div>
        <div class={s.page}>
          <svg class={s.svg} onClick={() => getData('prev')}><use xlinkHref='#prev'></use></svg>
          <svg class={s.svg} onClick={() => getData('next')}><use xlinkHref='#next'></use></svg>
        </div>
      </div >
    )
  }
})