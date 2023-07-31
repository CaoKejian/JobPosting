import { defineComponent, onMounted, ref } from 'vue';
import s from './Detail.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Model } from '../../shared/Model';
import { FormItem } from '../../shared/Form';
import { Button } from '../../shared/Button';
import { useRouter } from 'vue-router';
import { FloatButton } from '../../shared/FloatButton';
import { MenuBar } from '../../layouts/MenuBar';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';
import { Toast } from 'vant';
import { Time } from '../../shared/Time';

export const Detail = defineComponent({
  setup: (props, context) => {
    const isShowVisible = ref<boolean>(true)
    const classId = ref<string>('')
    const isHaveClass = ref<boolean>(false)
    const searchValue = ref<string>('')
    const myArr = ref<Work[]>([])
    const otherArr = ref<Work[]>([])
    const isShowMenu = ref<boolean>(false)
    const page = ref<number>(0)
    const router = useRouter()
    const onChangeModel = (value1:string,value2:number) => {
      if(value2===1){
        console.log('你正在搜索班级群：',classId.value);
        isHaveClass.value = true
        localStorage.setItem('classID', classId.value)
      }
    }
    const fetchData = async (id:string, page: number) => {
      try{
        const data = await http.get<Work[]>('/work', {
          classID:id,
          page: page + 1
        },{
          _autoLoading:true
        })
        const obj = data.data
        otherArr.value = obj
      }catch(error){
        Toast({
          message: '获取错误'
        })
      }
    }
    const fetchMyData = async (id:string,page:number) => {
      try{
        const data = await http.get<Work[]>('/work/mywork',{
          stuId : id,
          page: page + 1
        },{_autoLoading:true})
        console.log(data);
        const obj = data.data
        myArr.value = obj
        }catch(error){
          Toast({
            message: '获取错误'
          })
      }
    } 
    onMounted(async () => {
      const classID= localStorage.getItem('classID')
      const stuId = JSON.parse(localStorage.getItem('info') as string).stuId
      classID && fetchData(classID,page.value)
      stuId && fetchMyData(stuId,page.value)
      if(classID&&classID!==null&&classID!==undefined){
        isHaveClass.value = true
        isShowVisible.value = false
      }else{
        isHaveClass.value = false
        isShowVisible.value = true
      }
    })
    const go = (num:number) => {
      router.push(`/student/${num}/view`)
    }
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true}/>,
          title: () => '作业详情',
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
                  {
                    myArr.value.length===0 ? (
                      <div class={s.emptyBox}>
                        <img class={s.empty} src="/src/assets/img/empty.png" alt="" />
                        <span>空空哒~</span>
                      </div>):
                      <van-swipe class="my-swipe" autoplay={3000} indicator-color="white">
                        {
                      myArr.value.map(item => {
                        return (
                            <van-swipe-item>
                              <div class={s.box}>
                                <div class={s.infoF}>
                                  <img src="/src/assets/img/author.png" alt="" />
                                  <span class={s.name}>colin</span> 
                                  <Button>取消提交</Button> 
                                  <Button>修改</Button>
                                </div>
                                <div class={s.infoB}>
                                  <div class={s.left}>
                                    <div class={s.info}><div class={s.type}>姓名</div><span>曹珂俭</span></div>
                                    <div class={s.info}><div class={s.type}>上传文件</div><span>{item.file.fileName}</span></div>
                                    <div class={s.info}><div class={s.type}>学科</div><span>{item.subject}</span></div>
                                  </div>
                                  <div class={s.right}>
                                    <div class={s.info}><div class={s.type}>时间</div><span>{Time(item.time)}</span></div>
                                  </div>
                                </div>
                            </div>
                            </van-swipe-item>
                        )
                      })
                    }
                    </van-swipe>
                  }
              </div>
              <div class={[s.my,s.other]}>
                <div class={s.content}>
                  <span>班级成员</span>
                  <span onClick={() => go(0)}>全部</span>
                  <svg onClick={() => go(0)} class={s.svg}><use xlinkHref='#go'></use></svg>
                </div>
                {
                otherArr.value.length ===0 ? (
                      <div class={s.emptyBox}>
                        <img class={s.empty} src="/src/assets/img/empty.png" alt="" />
                        <span>空空哒~</span>
                      </div>):(
                        otherArr.value.map((item,index) => {
                          return <div class={[s.box,s.box1]}>
                          <div class={s.infoF}>
                            {index + 1}. 
                            <img src="/src/assets/img/author.png" alt="我" />
                            <span class={s.name}>colin</span> <span class={s.time}>{Time(item.time)}</span>
                            <Button>查看</Button> 
                          </div>
                          <div class={s.infoB}>
                            <div class={s.left}>
                              <div class={s.info}><div class={s.type}>姓名</div><span>曹珂俭</span></div>
                              <div class={s.info}><div class={s.type}>上传文件</div><span>{item.file.fileName}</span></div>
                              <div class={s.info}><div class={s.type}>学科</div><span>{item.subject}</span></div>
                            </div>
                            <div class={s.right}>
                                <img src="/src/assets/img/award.png" alt="" />
                                <span class={s.award}>优秀奖</span>
                            </div>
                          </div>
                        </div>
                        })
                      )
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
            <FloatButton />
            {
              isShowMenu.value ?
              <MenuBar onClose={() => isShowMenu.value = false} />
              : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})
