// index.js
import { getChannelList } from '../../../../api/index';
const topicBehaviour = require('../../behaviors/index');
const computedBehavior = require('miniprogram-computed').behavior;
Component({
  behaviors: [topicBehaviour, computedBehavior],
  /**
   * 组件的初始数据
   */
  properties: {
    parentCtx: null,
  },
  data: {
    pickerVisible: false,
    selected: '',
    selectedCode: '',
    preProductType: '',
    apiChannelList: [],
  },
  computed: {
    columns(data) {
      let columns = [];
      if (data.apiChannelList.length > 0) {
        data.apiChannelList.map(item => {
          columns.push({ text: item.desc, code: item.code });
        });
      } else {
        if (data.content.formKey !== 'channel') {
          data.content?.checkList.map(item => {
            columns.push({ text: item.value });
          });
        }
      }

      return columns;
    },
    formValue(data) {
      return data.selectedCode;
    },
  },
  observers: {
    parentCtx: function (newVal) {
      this.fetchChannelList();
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onConfirm(e) {
      this.setData({
        selected: e.detail.value.text,
        selectedCode: e.detail.value.code || e.detail.value.text,
        pickerVisible: false,
      });
    },
    openPicker() {
      this.setData({
        pickerVisible: true,
      });
    },
    onClose() {
      this.setData({
        pickerVisible: false,
      });
    },
    async fetchChannelList() {
      const { content, parentCtx, preProductType } = this.data;
      if (content.formKey === 'channel') {
        if (!parentCtx) {
          this.setData({
            apiChannelList: [],
          });
          return;
        }
        let productType = /袋/g.test(parentCtx.interest.value) ? 1 : 2;
        if (preProductType === productType) {
          return;
        }
        this.setData({
          selected: '',
          selectedCode: '',
        });
        const res = await getChannelList({
          productType,
        });
        this.setData({
          apiChannelList: res,
          preProductType: productType,
        });
      }
    },
  },
  lifetimes: {
    async attached() {
      console.$fp = this;
      //this.fetchChannelList()
    },
  },
});
