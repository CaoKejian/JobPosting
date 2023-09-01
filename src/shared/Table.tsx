import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Table.module.scss';
import { Form, FormItem } from './Form';
import { ClassSelectItem } from '../vite-env';
export const Table = defineComponent({
  props: {
    data: {
      type: Array as PropType<any[]>
    }
  },
  setup: (props, context) => {
    const selectData = ref<ClassSelectItem[]>([
      {value:'1',text:'姓名'},
      {value:'2',text:'学号'},
      {value:'3',text:'班级'},
      {value:'4',text:'学委'},
      {value:'5',text:'超级管理员'},
    ])
    const searchValue = ref('')
    const selectValue = ref(selectData.value[0].text)
    const tdata = [
      { name: '曹珂俭', email: '1849201815@qq.com', stuId: 2001063037, classId: '大数据B201', isAuth: false, isRoot: false },
      { name: '2', email: '1@qq.com', stuId: 2001, classId: '智能B2222', isAuth: false, isRoot: false },
      { name: '3', email: '1@qq.com', stuId: 2001, classId: 111, isAuth: false, isRoot: false },
      { name: '4', email: '1@qq.com', stuId: 2001, classId: 111, isAuth: false, isRoot: false },
      { name: '5', email: '1@qq.com', stuId: 2001, classId: 111, isAuth: false, isRoot: false },
    ]
    const tTitle = ['姓名', '学号', '邮箱', '班级', '操作']
    const prev =() => {

    }
    const  next = () => {

    }
    const onSearch = () => {
      
    }
    onMounted(() => {
      selectValue.value = selectData.value[0].text
      console.log(selectData.value[0].text)
    })
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
              tdata.map(item => {
                return <div class={s.item} key={item.name}>
                  <ul>
                    <li>{item.name}</li>
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
          <svg class={s.svg} onClick={prev}><use xlinkHref='#prev'></use></svg>
          <svg class={s.svg} onClick={next}><use xlinkHref='#next'></use></svg>
        </div>
      </div>
    )
  }
})