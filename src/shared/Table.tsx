import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Table.module.scss';
import { Form, FormItem } from './Form';
import { ClassSelectItem, User } from '../vite-env';
import { throttle } from './Throttle';
import { Model } from './Model';
import { Checkbox, Toast } from 'vant';
import { http } from './Http';
export const Table = defineComponent({
  props: {
    data: {
      type: Array as PropType<User[]>
    },
    pagination: {
      type: Object as PropType<{ currentPage: string, perPage: number, total: number, totalPages: number }>
    }
  },
  emits: ['update:value', 'search:value',"refresh:value"],
  setup: (props, context) => {
    const selectData = ref<ClassSelectItem[]>([
      { value: '1', text: '姓名' },
      { value: '2', text: '学号' },
      { value: '3', text: '班级' },
      { value: '4', text: '学委' },
      { value: '5', text: '超级管理员' },
    ])
    const selectAuthData = ref<ClassSelectItem[]>([
      { value: '1', text: '无' },
      { value: '2', text: '总裁' },
      { value: '3', text: '管理员' },
    ])
    const searchValue = ref<string>('')
    const selectValue = ref(selectData.value[0].text)
    const selectAuth = ref('')
    const selectUser = ref<User>()
    const tTitle = ['姓名', '学号', '邮箱', '班级', '操作']
    const isOpen = ref(false)
    const getData = throttle((n: string) => {
      const pagin = props.pagination
      if(n==='prev'){
        parseInt(pagin?.currentPage as string) >= 2 &&
        context.emit('update:value', {page: +(pagin?.currentPage)! - 1 })
      }else if(n==='next'){
        if(pagin?.currentPage === pagin?.totalPages){
          Toast({message: '没有下一页了'})
        }else{
        context.emit('update:value', {page: +(pagin?.currentPage)! + 1 })
        }
      }
    }, 1000)
    const onSet = (item: User) => {
      isOpen.value = true
      selectUser.value = item
      selectAuth.value = (item.isRoot ? selectAuthData.value[2].text :(item.isAuth ? selectAuthData.value[1].text : selectAuthData.value[0].text) )
    }
    const onChangeModel = async(value1:string,value2:number) => {
      if(selectAuth.value!== '无' && value2===1){
        const isRoot = selectAuth.value ==='管理员' ? true: false
        http.post('/user/president/set',{
          stuId:selectUser.value?.stuId,
          isRoot
        },{_autoLoading:true})
      }
      if(selectAuth.value==='无'&&value2 ===1){
        http.post('/user/president/delete',{stuId:selectUser.value?.stuId},{_autoLoading:true})
      }
      context.emit('refresh:value', 'refresh')
    }
    const onSearch = () => {
      context.emit('search:value', searchValue.value)
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
                    <li class={s.set} onClick={() => onSet(item)}>设置</li>
                  </ul>
                </div>
              })}
          </div>
        </div>
        {
          isOpen.value ?
            <Model v-model:modelVisible={isOpen.value}
            onUpdate:modelVisible={onChangeModel}>{
              {
                title: () => '设置',
                content: () => <div class={s.model}>
                  <Form>
                    <FormItem label='设置总裁权限/管理员权限'
                      type='select' v-model={selectAuth.value}
                      options={selectAuthData.value}
                    ></FormItem>
                  </Form>
                </div>
              }
            }</Model>
            : null
        }
        <div class={s.page}>
          <svg class={s.svg} onClick={() => getData('prev')}><use xlinkHref='#prev'></use></svg>
          <div class={s.currentPage}>{props.pagination?.currentPage}</div>
          <svg class={s.svg} onClick={() => getData('next')}><use xlinkHref='#next'></use></svg>
        </div>
      </div >
    )
  }
})