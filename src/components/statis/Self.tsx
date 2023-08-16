import { PropType, defineComponent, reactive, ref } from 'vue';
import s from './Self.module.scss';
import { Form, FormItem } from '../../shared/Form';
import { Toast } from 'vant';
import { getAssetsFile } from '../../config/imgUtil';
import { classMapFunction } from '../../config/NameMap';
import { http } from '../../shared/Http';

type formDataObj = {
  searchPeople: number | string
  isEmpty: boolean
  searchInfo: { _id: number, name: string, stuId: number, classId: number, data: [] } | null
}
export const Self = defineComponent({
  props: {
    name: {
      type: String as PropType<string>
    }
  },
  setup: (props, context) => {
    const formData = reactive<formDataObj>({
      searchPeople: '',
      isEmpty: true,
      searchInfo: null
    })
    const fetchWork = async (stuId: number|string) => {
      try {
        const data = await http.get('/work/mywork', {
          stuId,
        }, { _autoLoading: true })
        console.log(data)
        Object.assign(formData, {
          isEmpty: false,
          searchInfo:
            { _id: 22222, name: '曹珂俭', stuId: 2001063037, classId: 123123, data: [] },
        })
      }catch(err){
        console.log(err)
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
            placeholder='学号/姓名'
          ></FormItem>
        </Form>
        {
          formData.isEmpty ?
            <div class={s.empty}>
              <img src={`${getAssetsFile('empty.png')}`} alt="" />
            </div> : <div class={s.list}>
              <div class={s.item}>
                <span class={s.info}>{formData.searchInfo?.name}-{formData.searchInfo?.stuId}-{classMapFunction(formData.searchInfo!.classId)}</span>
                <span>请核验信息！</span>
                <div class={s.itemList}>
                  {
                    formData.searchInfo?.data.length !== 0 ?
                      formData.searchInfo?.data.map(item => {
                        return <div key={item}>
                          123
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