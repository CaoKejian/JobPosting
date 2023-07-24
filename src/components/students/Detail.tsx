import { PropType, defineComponent, onMounted, ref } from 'vue';
import s from './Detail.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Model } from '../../shared/Model';
import { FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { useRouter } from 'vue-router';
export const Detail = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(true)
    const classId = ref<string>('')
    const isHaveClass = ref<boolean>(false)
    const searchValue = ref<string>('')
    const otherArr = ref([1,2,3])
    const router = useRouter()
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
    const go = (num:number) => {

      router.push(`/student/${num}/view`)
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon />,
          title: () => '学生作业详情',
          default: () => <div class={s.container}>
            {isHaveClass.value ?
            <div class={s.wrapper}>
              <div class={s.search}>
                <van-search  shape="round" background='none' v-model:searchValue={searchValue.value} placeholder="请输入搜索关键词" />
                <div class={s.title}>搜索</div>
              </div>
              <div class={s.my}>
                <div class={s.content}>
                  <span>我参与的</span>
                  <span onClick={() => go(1)}>全部</span>
                  <svg onClick={() => go(1)} class={s.svg}><use xlinkHref='#go'></use></svg>
                </div>
                <div class={s.box}>
                  <div class={s.infoF}>
                    1. 
                    <img src="/src/assets/img/a.jpg" alt="我" />
                    <span class={s.name}>colin</span> <span class={s.time}>1分钟前</span>
                    <Button>取消提交</Button> 
                    <Button>修改</Button>
                  </div>
                  <div class={s.info}><div class={s.type}>姓名</div><span>曹珂俭</span></div>
                  <div class={s.info}><div class={s.type}>上传文件</div><span>hahahah.doc</span></div>
                  <div class={s.info}><div class={s.type}>学科</div><span>高数1</span></div>
                </div>
              </div>
              <div class={[s.my,s.other]}>
                <div class={s.content}>
                  <span>班级成员</span>
                  <span onClick={() => go(0)}>全部</span>
                  <svg onClick={() => go(0)} class={s.svg}><use xlinkHref='#go'></use></svg>
                </div>
                {
                  otherArr.value.map(item => {
                    return <div class={[s.box,s.box1]}>
                    <div class={s.infoF}>
                      {item}. 
                      <img src="/src/assets/img/a.jpg" alt="我" />
                      <span class={s.name}>colin</span> <span class={s.time}>1分钟前</span>
                      <Button>查看</Button> 
                      {/* <Button>修改</Button> */}
                    </div>
                    <div class={s.info}><div class={s.type}>姓名</div><span>曹珂俭</span></div>
                    <div class={s.info}><div class={s.type}>上传文件</div><span>hahahah.doc</span></div>
                    <div class={s.info}><div class={s.type}>学科</div><span>高数1</span></div>
                  </div>
                  })
                }
              </div>
            </div>
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
