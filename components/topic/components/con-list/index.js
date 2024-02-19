// index.js
import dayjs from 'dayjs';
import { getTopicListByPageId } from '../../../../api/topic';
import { genLink } from '../../../../utils/util';

const topicBehaviour = require('../../behaviors/index');

Component({
  behaviors: [topicBehaviour],
  observers: {
    content: function (val) {
      this.fetchList();
    },
  },
  /**
   * 组件的初始数据
   */
  data: {
    list: [],
    listA: [],
    listB: [],
  },
  /**
   * 组件的方法列表
   */
  methods: {
    jumpToPage(e) {
      const { item } = e.currentTarget.dataset;
      // console.log('jumpToPage',item);
      genLink({ type: 'topic', page_id: item.page_id });
    },
    async fetchList() {
      let { content, list } = this.data;
      let listA = [],
        listB = [];
      if (content.topicIds.length === 0) {
        list = [];
        this.setData({
          list,
        });
        return;
      }
      const res = await getTopicListByPageId({ page_ids: content.topicIds.join(',') });
      res.map((item, index) => {
        item.create_time = dayjs(item.create_time).format('YYYY年MM月DD日 HH:mm:ss');
        if (index % 2 === 0) {
          listA.push(item);
        } else {
          listB.push(item);
        }
      });
      list = res;
      this.setData({
        list,
        listB,
        listA,
      });
    },
  },
});
