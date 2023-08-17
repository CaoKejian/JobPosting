import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Self.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { Toast } from 'vant';
import { getAssetsFile } from '../../config/imgUtil';
import { classMapFunction, stuIdMapFunction } from '../../config/NameMap';
import { http } from '../../shared/Http';
import { Work } from '../../vite-env';

type formDataObj = {
  searchPeople: number | string
  isEmpty: boolean
  searchInfo: Work[] | null
  info: { name: string, classId?: number, stuId?: number }
}
export const Self = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const formData = reactive<formDataObj>({
      searchPeople: '2001063037',
      isEmpty: true,
      searchInfo: null,
      info: { name: '', classId: undefined, stuId: undefined }
    })
    const fetchWork = async (stuId: number | string) => {
      try {
        const data = await http.get<Work[]>('/work/mywork', {
          stuId,
        }, { _autoLoading: true })
        console.log(data)
        if (data.data.length === 0) {
          Object.assign(formData, {
            isEmpty: true,
            searchInfo: [],
            info: {}
          })
          Toast({
            message: '没有提交！'
          })
          return
        }
        Object.assign(formData, {
          isEmpty: false,
          searchInfo: data.data,
          info: {
            name: stuIdMapFunction(data.data[0].stuId),
            stuId: formData.searchPeople,
            classId: data.data[0].classId
          }
        })
      } catch (err) {
        Toast({ message: err as any })
      }
    }
    const onSearch = () => {
      if (!formData.searchPeople) {
        Toast({
          message: '搜索不能为空！'
        })
        return
      }
      fetchWork(formData.searchPeople)
    }
    return () => (
      <div class={s.content}>
        <p>查询同学提交过的作业：</p>
        <Form>
          <FormItem label='' type='search'
            onSearch={onSearch}
            v-model={formData.searchPeople}
            placeholder='学号'
          ></FormItem>
        </Form>
        {
          formData.isEmpty ?
            <div class={s.empty}>
              <img src={`${getAssetsFile('empty.png')}`} alt="" />
            </div> : <div class={s.list}>
              <div class={s.item}>
                <span class={s.info}>{formData.info?.name}-{formData.info.stuId}-{classMapFunction(formData.info.classId)}</span>
                <span>请核验信息！</span>
                <div class={s.itemList}>
                  {
                    formData.searchInfo?.length !== 0 ?
                      formData.searchInfo?.map((item, index) => {
                        return <div key={item._id} class={s.workList}>
                          <div class={s.workItem}>
                            <div class={s.index}>{index + 1}、</div>
                            <div class={s.workName}>{item.branch}</div>
                            <div>「React」 </div>
                            <span>T发布者</span>
                            <div class={s.time}>2023月9月2日</div>
                          </div>
                        </div>
                      }) : <p class={s.infoEmpty}>暂无数据</p>
                  }
                </div>
              </div>
            </div>
        }

      </div>
    )
  }
})