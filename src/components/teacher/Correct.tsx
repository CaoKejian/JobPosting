import { PropType, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import s from './Correct.module.scss';
import { MainLayout } from '../../layouts/MainLayout';
import { BackIcon } from '../../shared/BackIcon';
import { Quote } from '../../shared/Quote';
import { Form, FormItem } from '../../shared/Form';
import { http } from '../../shared/Http';
import { classMapFunction, classIdMapFunction } from '../../config/NameMap';
import { Class, ClassSelectItem, Work, WorkObj } from '../../vite-env';
import { getAssetsFile } from '../../config/imgUtil';
import { Toast } from 'vant';
import { Button } from '../../shared/Button';
import { Time } from '../../shared/Time';

import { DownLoadInfo } from '../../shared/DownLoad';
import { MenuBar } from '../../layouts/MenuBar';
export const Correct = defineComponent({
  setup: (props, context) => {
    const isShowMenu = ref(false)
    const classSelect = ref<ClassSelectItem[]>([])
    const subjectSelect = ref<ClassSelectItem[]>([])
    const formData = reactive({
      classId: '',
      user: '',
      branch: ''
    })
    const workData = ref<WorkObj[]>([])
    const passData = ref<{
      isPass: boolean,
      tComments: string,
      favor: boolean,
      score: number | null,
    }>({
      isPass: true,
      tComments: '',
      favor: false,
      score: null,
    })
    const errors = reactive({
      classId: [],
      branch: []
    })
    const fetchClassBranch = async () => {
      try{
        subjectSelect.value = []
        const branchRes = await http.get<Work[]>('/pub/user', { user: formData.user, classId: classIdMapFunction(formData.classId)})
        const branches = branchRes.data.map((item: any) => item = item.branch)
        branches.forEach((item, index) => {
          const subjectObj = {
            value: `${index} + 1`,
            text: item
          };
          subjectSelect.value.push(subjectObj);
        });
      }catch(err){
        console.log(err)
      }
    }
    const fetchMyClass = async () => {
      try {
        const response = await http.get<Class>('/subject/myclass', { user: formData.user }, { _autoLoading: true })
        const data = response.data.classes
        data.forEach((item, index) => {
          const classObj = {
            value: `${index} + 1`,
            text: classMapFunction(item)
          };
          classSelect.value.push(classObj);
        });
        if(response.data.classes.length!==0){
          formData.classId = classSelect.value[0].text
        }
      } catch (err) {
        console.log(err)
      }
    }
    const fetchMyClassWork = async () => {
      try {
        Toast.loading({
          message: '加载中...',
          forbidClick: true,
        })
        const data = await http.get<Work[]>('/work/correct/work', {
          classId: classIdMapFunction(formData.classId), branch: formData.branch,
        }, { _autoLoading: true })
        workData.value = data.data
        Toast.clear()
        if(workData.value.length===0) Toast({message: '没有更多作业了'})
      } catch (err) {
        console.log(err)
      }
    }
    watch(() => formData.branch, async (newValue) => {
      if (formData.classId === '') {
        Toast({ message: '请先选择班级！' })
        return
      }
      fetchMyClassWork()
    })
    watch(() => formData.classId, (newValue) => {
      fetchClassBranch()
    })
    const download = async (index: number) => {
      await DownLoadInfo(workData.value[index].file);
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    const next = async (index: number) => {
      /* 作业批改 */
        try{
          Object.assign(workData.value[index], passData.value)
          await http.post('/work/upload', workData.value[index], {_autoLoading:true})
          Toast({message: '批改成功！'})
          if(index === workData.value.length - 1){
            workData.value = []
            setTimeout(() => {
              Toast({message: '全部批改完成'})
            },1000)
          }
          Object.assign(passData.value, {
            isPass: false,
            tComments: '',
            favor: false,
            score: null,
          })
          swipe.value.next()
        }catch(err){
          Toast({message: '批改失败！'})
        }
      }
    const prev = () => {
      swipe.value.prev()
    }
    onMounted(() => {
      const info = JSON.parse(localStorage.getItem('info') as string)
      formData.user = info.name
      fetchMyClass()
    })
    const swipe = ref()
    return () => (
      <MainLayout>{
        {
          icon: () => <BackIcon svg='menu' onClick={() => isShowMenu.value = true} />,
          title: () => '作业批改',
          default: () => <div class={s.container}>
            <div class={s.content}>
              <p><Quote name='批改作业' /></p>
              <Form>
                <FormItem label='请选择班级' type='select' v-model={formData.classId} options={classSelect.value} error={errors.classId?.[0] ?? '　'}>
                </FormItem>
                <FormItem label='请选择作业分支' type='select' v-model={formData.branch} options={subjectSelect.value} error={errors.branch?.[0] ?? '　'}>
                </FormItem>
              </Form>
            </div>
            <div class={s.data}>
              {
                workData.value.length === 0 ?
                  <div class={s.empty}>
                    <img src={`${getAssetsFile('empty.png')}`} alt="" />
                  </div> :
                  <div class={s.wrapper}>
                    <van-swipe class="my-swipe" loop={true} duration={1000}
                      indicator-color='#7580f5' ref={swipe}>
                      {
                        workData.value.map((item, index) => {
                          return (
                            <van-swipe-item key={index}>
                              <div class={s.box}>
                                <div class={s.top}>
                                  {item.time - item.cutTime < 0 ?
                                    <span>未逾期</span> :
                                    <span class={s.overTime}>逾期</span>
                                  }
                                  <span>提交人：<span class={s.name}>{item.name}</span></span>
                                </div>
                                <div class={s.center}>
                                  <div>
                                    <span>学号：</span>
                                    <span class={s.centerFont}>{item.stuId}</span>
                                  </div>
                                  <div>
                                    <span>提交时间：</span>
                                    <span class={s.centerFont}>{Time(item.time)}</span>
                                  </div>
                                </div>
                                <div class={s.file}>
                                  <span>上传文件：<span class={s.filename}>{item.file.fileName}</span></span>
                                  <Button onClick={() => download(index)}>下载</Button>
                                </div>
                                <div class={s.comment}>
                                  <Form>
                                    <FormItem label='分数' placeholder='打分' type='score' v-model={passData.value.score}></FormItem>
                                    <FormItem label='是否优秀' type='radio' v-model:radioType={passData.value.favor}></FormItem>
                                    <FormItem label='评语' type='text' v-model={passData.value.tComments}></FormItem>
                                  </Form>
                                </div>
                                <div class={s.controller}>
                                  <Button onClick={prev}>上一个</Button>
                                  <Button onClick={() => next(index)} class={s.pass}>通过</Button>
                                </div>
                              </div>
                            </van-swipe-item>
                          )
                        })
                      }
                    </van-swipe>
                  </div>
              }
            </div>
            {
              isShowMenu.value ?
                <MenuBar name={'teacher'} onClose={() => isShowMenu.value = false} />
                : null
            }
          </div>
        }
      }</MainLayout>
    )
  }
})